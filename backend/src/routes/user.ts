import { Hono } from 'hono'
import { PrismaClient} from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"
import { sign , verify} from "hono/jwt"
import { signupInput, signinInput } from '@amanhere/medium-common'

export const userRouter = new Hono<{
    Bindings: {
      DATABASE_URL : string,
      JWT_SECRET: string
    },
    Variables: {
        userId: string
    }
  }>()
userRouter.post('/newsletter', async (c) => {
  const body = await c.req.json();
  console.log("Newsletter request body:", body);
  if (!body) {
    c.status(400);
    return c.json({ error: "Email is required" });
  }
  console.log("email: ",body)
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const create = await prisma.newsLetter.create({
      data: {
        email: body
      }
    });

    return c.json({
      message: "Subscription successful",
      subscriber: create
    });

  } catch (error) {
    console.error("Newsletter error:", error);
    c.status(500);
    return c.json({ error: "Server is down" });
  }
});
userRouter.post('/signup',async (c) => {
    const body = await c.req.json();
    console.log("body: ", body)
    const { success } = signupInput.safeParse(body);
    if (!success){
        c.status(411);
        return c.json({
            error: "Enter all the details"
        })
    }
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    try {
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${body.name}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${body.name}`;
    const userExist = await prisma.user.findFirst({
      where:{
        email: body.email
      }
    })
    if (userExist){
      c.status(404);
      return c.json({ error: "User already exists"})
    }
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name,
        gender: body.gender,
        profilePic: body.gender.toLowerCase() == 'male'? boyProfilePic: girlProfilePic
      }
    })
    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({
      jwt: token,
      userData: user
    })
      
    } catch (error) {
      c.status(411);
      return c.text('Error while Signup')
    }
  } )
  
  
userRouter.post('/signin',async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
  
    const body = await c.req.json();
    const { success } = signinInput.safeParse(body);
    if (!success){
        c.status(411);
        return c.json({
            error: "Enter a valid email address"
        })
    }
  
    try {
      const user = await prisma.user.findFirst({
        where: {
          email: body.email,
          password: body.password
          }
      })
      if (!user) {
        c.status(403);
        return c.json({ error: "Incorrect credentials" });
      }
      const token = await sign({id:user.id}, c.env.JWT_SECRET);
      return c.json({
        jwt: token,
        userData: user
      })
      
    } catch (error) {
      console.log(error);
      c.status(411);
      return c.json({ error: "Invalid login" })    }
  
  } )

// Middleware for protected routes
userRouter.use('/profile', async (c, next) => {
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

userRouter.use('/my-blogs', async (c, next) => {
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

// Update user profile
userRouter.post('/profile', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    try {
      const body = await  c.req.json();
      const user = await prisma.user.update({
        where: {
          email: body.email,
        },
        data: {
          bio: body.bio
        }
      });
      
      return c.json({
        userData: user,
        msg:"Updated"
      })
      
    } catch (error) {
      console.log(error);
      c.status(411);
      return c.json({
        error: "Error updating profile"
      })
    }
})

// Get user's own blogs
userRouter.get('/my-blogs', async (c) => {
    const authorId = c.get("userId")
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const blogs = await prisma.blog.findMany({
            where: {
                authorId: authorId
            },
            select: {
                id: true,
                title: true,
                content: true,
                published: true,
                blogCreatedTime: true,
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

        return c.json({
            blogs
        })
    } catch (error) {
        console.log(error);
        c.status(411);
        return c.json({
            error: "Failed to fetch your blogs"
        })
    }
})

// Get user profile by ID
userRouter.get('/:id', async (c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
      const user = await prisma.user.findFirst({
        where: {
          id: id
        },
        select:{
          id: true,
          email: true,
          name: true,
          bio: true,
          userCreatedTime:true,
          profilePic: true,
          gender: true,
          blogs: {
            where: {
              published: true // Only show published blogs in profile
            },
            select: {
              id: true,
              title: true,
              content: true,
              blogCreatedTime: true,
              published: true
            },
            orderBy: {
              blogCreatedTime: 'desc'
            }
          }
        }
      })

      return c.json({
        userDetails: user
      })

    } catch (error) {
      console.log(error);
      c.status(411);
      return c.json({
        error: "Failed to fetch user profile"
      })
    }
})