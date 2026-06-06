import { zValidator } from "@hono/zod-validator"
import { db } from "@selfcode/database/client"
import { Role ,Mode ,MessageStatus} from "@selfcode/database/enums"
import { isSupportedChatModel } from "../lib/models"
import { Hono } from "hono"
import z from "zod"
import type { AuthenticatedEnv } from "../middleware/require-auth"
import { requireCreditsBalance } from "../middleware/require-credits-balance"


const createSessionSchema= z.object({
    title : z.string(),
    cwd: z.string().optional(),
    initialMessage:z.object({
        role:z.enum(Role),
        content: z.string(),
        mode:z.enum(Mode),
        model:z.string().refine(isSupportedChatModel,"Unsupported model")
    }).optional()
})

const createSessionValidator = zValidator("json",createSessionSchema,(result,c)=>{
    if(!result.success){
        return c.json({error:"Invalid request body"},400)
    }
})

const app=new Hono<AuthenticatedEnv>()
    .get("/",async (c)=>{
        const userId=c.get("userId")
        const sessions =await db.session.findMany({
            where:{userId},
            orderBy:{createdAt:"desc"},
            select:{
                id:true,
                title:true,
                createdAt:true
            }
        })

        return c.json(sessions)
    })
    .get("/:id",async(c)=>{
       
        const id = c.req.param("id")
        const userId=c.get("userId")

        const session = await db.session.findUnique({
            where:{id , userId},
            include:{
                messages:{orderBy : {createdAt : "asc"}}
            }
        })

        if(!session){
            return c.json({error:"Session not found"},404)
        }

        return c.json(session)
    })
    .post("/",requireCreditsBalance ,createSessionValidator,async(c)=>{
        
        const {initialMessage,...data}=c.req.valid("json")
        const userId=c.get("userId")
        const session = await db.session.create({
            data:{
                ...data,
                userId,
                ...(initialMessage && {
                    messages:{
                        create:{
                            ...initialMessage,
                            status:MessageStatus.COMPLETE
                        }
                    }
                })
            },
            include:{messages:true}
        })
     
        return c.json(session,201)
    })

export default app