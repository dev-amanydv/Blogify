import { Hono } from 'hono'
import { PrismaClient} from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"
import { decode, sign , verify} from "hono/jwt"
import { signupInput, signinInput } from '@amanhere/medium-common'

export const userRouter = new Hono<{
    Bindings: {
      DATABASE_URL : string,
      JWT_SECRET: string
    }
  }>()

userRouter.post('/signup',async (c) => {
    const body = await c.req.json();
    const { success } = signupInput.safeParse(body);
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
  
    //zod and passwordhashing
    //const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${body.email}`;
    //const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${body.email}`;
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${body.name}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${body.name}`;
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
            error: " Inputs not correct"
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
      return c.text("Invalid ")
    }
  
  } )
userRouter.use('/profile', async (c, next) => {
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
          gender: true
        }
      })

      return c.json({
        userDetails: user
      })

    } catch (error) {
      console.log(error);
      c.status(411);
      return 
    }
  })
  