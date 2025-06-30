import { Hono } from 'hono'
import { PrismaClient} from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"
import { verify} from "hono/jwt"
import { createBlogInput, updateBlogInput } from '@amanhere/medium-common'

export const blogRouter = new Hono<{
    Bindings: {
      DATABASE_URL : string,
      JWT_SECRET: string
    },
    Variables: {
        userId: string
    }
  }>()

  blogRouter.get('/bulk',async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
          }).$extends(withAccelerate());

        const blogs = await prisma.blog.findMany({
            where: {
                published: true 
            },
            select: {
                content: true,
                title: true,
                id: true,
                blogCreatedTime: true,
                published: true,
                author: {
                    select: {
                        name: true,
                        profilePic: true
                    }
                }
            },
            orderBy: {
                blogCreatedTime: 'desc'
            }
        });

        const total = await prisma.blog.count({ where: { published: true } });

        return c.json({
            blogs,
            total,
        })
    } catch (error) {
        console.error("Error fetching blogs:", error);
        c.status(500);
        return c.json({
            error: "Failed to fetch blogs",
            details: error instanceof Error ? error.message : "Unknown error"
        })
    }
  })


  blogRouter.use('/*', async (c, next) => {
   
    const authHeader = c.req.header("authorization") || "";

    try {
        const token = authHeader.split(" ")[1]
    const user = await verify(token, c.env.JWT_SECRET);
  
    if (user){
        //@ts-ignore
        c.set("userId", user.id);
      await next()
    } else {
      c.status(403)
      return c.json({
        error: "unauthorized"
      })
    }
  
    } catch (error) {
        c.status(403);
        return c.json({
            error: "You are not logged in"
        })
    }
    
  })
  

  blogRouter.post('/',async (c) => {
    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);
        if (!success){
            c.status(411);
            return c.json({
                error: "Inputs not correct",
            })
        }
    const authorId = c.get("userId")
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const blog = await prisma.blog.create({
            data:{
                title: body.title,
                content: body.content,
                authorId: authorId,
                published: body.published !== undefined ? body.published : true
            }
        })
    
        return c.json({
            id: blog.id,
        })
        
    } catch (error) {
        console.error("Error creating blog:", error);
        c.status(500);
        return c.json({
            error: "Something went wrong while creating blog",
            details: error instanceof Error ? error.message : "Unknown error"
        })
    }
  })


  blogRouter.post('/draft', async (c) => {
    console.log("Reached draft")
    try {
        console.log("Reached in '/draft'")
        const body = await c.req.json();
        const authorId = c.get("userId")
        
        if (!authorId) {
            c.status(401);
            return c.json({
                error: "User not authenticated"
            });
        }

        const prisma = new PrismaClient({
          datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const blog = await prisma.blog.create({
            data:{
                title: body.title || "Untitled Draft",
                content: body.content || "",
                authorId: authorId,
                published: false
            }
        })
    
        return c.json({
            id: blog.id,
            message: "Draft saved successfully"
        })
        
    } catch (error) {
        console.error("Error saving draft:", error);
        c.status(500);
        return c.json({
            error: "Failed to save draft",
            details: error instanceof Error ? error.message : "Unknown error"
        })
    }
  })


  blogRouter.get('/drafts', async (c) => {
    try {
        const authorId = c.get("userId")
        
        if (!authorId) {
            c.status(401);
            return c.json({
                error: "User not authenticated"
            });
        }

        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const drafts = await prisma.blog.findMany({
            where: {
                authorId: authorId,
                published: false
            },
            select: {
                id: true,
                title: true,
                content: true,
                blogCreatedTime: true,
            },
            orderBy: {
                blogCreatedTime: 'desc'
            }
        });

        return c.json({
            drafts: drafts.map(draft => ({
                ...draft,
                lastModified: draft.blogCreatedTime 
            }))
        })
    } catch (error) {
        console.error("Error fetching drafts:", error);
        c.status(500);
        return c.json({
            error: "Failed to fetch drafts",
            details: error instanceof Error ? error.message : "Unknown error"
        })
    }
  })

  // Update draft
  blogRouter.put('/draft/:id', async (c) => {
    try {
        const id = c.req.param("id");
        const body = await c.req.json();
        const authorId = c.get("userId")
        
        if (!authorId) {
            c.status(401);
            return c.json({
                error: "User not authenticated"
            });
        }

        const prisma = new PrismaClient({
          datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const existing = await prisma.blog.findFirst({
            where: {
                id: id,
                authorId: authorId
            }
        });

        if (!existing) {
            c.status(404);
            return c.json({ error: "Draft not found or unauthorized" });
        }

        const blog = await prisma.blog.update({
            where: { id: id },
            data:{
                title: body.title || "Untitled Draft",
                content: body.content || ""
            }
        })
    
        return c.json({
            id: blog.id,
            message: "Draft updated successfully"
        })
        
    } catch (error) {
        console.error("Error updating draft:", error);
        c.status(500);
        return c.json({
            error: "Failed to update draft",
            details: error instanceof Error ? error.message : "Unknown error"
        })
    }
  })

  blogRouter.delete('/draft/:id', async (c) => {
    try {
        const id = c.req.param("id");
        const authorId = c.get("userId")
        
        if (!authorId) {
            c.status(401);
            return c.json({
                error: "User not authenticated"
            });
        }

        const prisma = new PrismaClient({
          datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        await prisma.blog.delete({
            where: {
                id: id,
                authorId: authorId // Ensure user can only delete their own drafts
            }
        })
    
        return c.json({
            message: "Draft deleted successfully"
        })
        
    } catch (error) {
        console.error("Error deleting draft:", error);
        c.status(500);
        return c.json({
            error: "Failed to delete draft",
            details: error instanceof Error ? error.message : "Unknown error"
        })
    }
  })
  
  // Update existing blog post
  blogRouter.put('/:id',async (c) =>{
    try {
        const id = c.req.param("id");
        const body = await c.req.json();
        const authorId = c.get("userId")
        const { success } = updateBlogInput.safeParse(body);
            if (!success){
                c.status(411);
                return c.json({
                    error: "Inputs not correct",
                })
            }
        const prisma = new PrismaClient({
          datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const existing = await prisma.blog.findFirst({
            where: {
                id: id,
                authorId: authorId
            }
        });

        if (!existing) {
            c.status(404);
            return c.json({ error: "Draft not found or unauthorized" });
        }

        const blog = await prisma.blog.update({
            where: { id: id },
            data:{
                title: body.title,
                content: body.content,
                published: body.published !== undefined ? body.published : true
            }
        })
    
        return c.json({
            id: blog.id,
            message: "Blog updated successfully"
        })
        
    } catch (error) {
        console.error("Error updating blog:", error);
        c.status(500);
        return c.json({
            error: "Failed to update blog",
            details: error instanceof Error ? error.message : "Unknown error"
        })
    }
  })

  // Delete blog post
  blogRouter.delete('/:id', async (c) => {
    try {
        const id = c.req.param("id");
        const authorId = c.get("userId")
        const prisma = new PrismaClient({
          datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        await prisma.blog.delete({
            where: {
                id: id,
                authorId: authorId // Ensure user can only delete their own blogs
            }
        })
    
        return c.json({
            message: "Blog deleted successfully"
        })
        
    } catch (error) {
        console.error("Error deleting blog:", error);
        c.status(500);
        return c.json({
            error: "Failed to delete blog",
            details: error instanceof Error ? error.message : "Unknown error"
        })
    }
  })


  blogRouter.get('/:id',async (c) => {
    try {
        const id = c.req.param("id");
        const prisma = new PrismaClient({
          datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const blog = await prisma.blog.findFirst({
            where: {
                id: id
            },
            select: {
                title: true,
                content: true,
                blogCreatedTime: true,
                id: true,
                published: true,
                author: {
                    select: {
                        id:true,
                        bio:true,
                        email:true,
                        gender:true,
                        name: true,
                        profilePic: true
                    }
                }
            }
        })
    
        return c.json({
            blog
        })
        
    } catch (error) {
        console.error("Error fetching blog:", error);
        c.status(500);
        return c.json({
            error: "Error while fetching blog post",
            details: error instanceof Error ? error.message : "Unknown error"
        })
    }
  })