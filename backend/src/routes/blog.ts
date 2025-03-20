import { Hono } from 'hono'
import { PrismaClient} from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"
import { decode, sign , verify} from "hono/jwt"
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


  blogRouter.use('/*', async (c, next) => {
    //get the header 
    //verify the header
    //if header is correct, proceed
    //extract authorId and pass down to route handler
    const authHeader = c.req.header("authorization") || "";
    //"Bearer token"
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
                error: " Inputs not correct"
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
                authorId: authorId
            }
        })
    
    
        return c.json({
            id: blog.id,
            
        })
        
    } catch (error) {
        c.status(511);
        return c.json({
            error: "Something went wrong"
        })
    }

  } )
  
  
  blogRouter.put('/',async (c) =>{
    const body = await c.req.json();
    const { success } = updateBlogInput.safeParse(body);
        if (!success){
            c.status(411);
            return c.json({
                error: " Inputs not correct"
            })
        }
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const blog = await prisma.blog.update({
            where: {
                id: body.id
            },

            data:{
                title: body.title,
                content: body.content
            }
        })
    
    
        return c.json({
            id: blog.id
        })
        
    } catch (error) {
        c.status(511);
        return c.json({
            error: "Something went wrong"
        })
    }
  } )  

  //Add pagination    
  blogRouter.get('/bulk',async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());

    const blogs = await prisma.blog.findMany({
        select: {
            content: true,
            title: true,
            id: true,
            blogCreatedTime: true,
            author: {
                select: {
                    name: true,
                    profilePic: true
                }
            }
        }
    });
    return c.json({
        blogs
    })
  })
  blogRouter.get('/:id',async (c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const blog = await prisma.blog.findFirst({
            where: {
                id: id
            },
            select: {
                title: true,
                content: true,
                blogCreatedTime: true,
                id: true,
                author: {
                    select: {
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
        c.status(511);
        return c.json({
            error: "Error while fetching blog post"
        })
    }
})

  
