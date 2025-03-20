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
  