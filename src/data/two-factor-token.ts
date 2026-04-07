import { db } from "@/lib/db"
import { cache } from "react"

export const getTwoFactorTokenByToken = cache(async(token:string) => {
     try{
          const twoFactorToken = await db.twoFactorToken.findUnique({
               where: {token}
          })
          return twoFactorToken
     } catch{
          return null
     }
})

export const getTwoFactorTokenByEmail = cache(async(email:string) => {
     try{
          const twoFactorToken = await db.twoFactorToken.findFirst({
               where: {email}
          })
          return twoFactorToken
     } catch{
          return null
     }
})