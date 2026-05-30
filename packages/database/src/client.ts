import { PrismaPg } from "@prisma/adapter-pg"
import dotenv from "dotenv"
import { PrismaClient } from "../generated/prisma/client"
import path from "path"

dotenv.config({
    path:path.resolve(import.meta.dirname,"../../../.env")
})

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl){
    throw new Error("db url is not set")
}

const adapter = new PrismaPg({connectionString:databaseUrl})

export const db = new PrismaClient({adapter})