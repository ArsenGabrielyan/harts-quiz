import { db } from "@/lib/db";
import { cache } from "react";

export const getVerificationTokenByEmail = cache(async (
     email: string
) => {
     try{
          const verificationToken = await db.verificationToken.findFirst({
               where: {email}
          })
          return verificationToken
     } catch {
          return null
     }
})

export const getVerificationTokenByToken = cache(async (
     token: string
) => {
     try{
          const verificationToken = await db.verificationToken.findUnique({
               where: {token}
          })
          return verificationToken
     } catch {
          return null
     }
})