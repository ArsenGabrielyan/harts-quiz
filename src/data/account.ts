import { db } from "@/lib/db"
import { cache } from "react"

export const getAccountByUserId = cache(async (userId: string) => {
     try{
          const account = await db.account.findFirst({
               where: {userId}
          })
          return account
     } catch{
          return null
     }
})