"use server"
import * as z from "zod"
import { NewPasswordSchema } from "@/lib/schemas"
import { getPasswordResetTokenByToken } from "@/data/password-reset-token"
import { getUserByEmail } from "@/data/user"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { NewPasswordType } from "@/lib/types/schema"

export const newPassword = async(
     values: NewPasswordType,
     token: string | null
) => {
     if(!token){
          return {error: "Բացակայում է վերականգման token-ը"}
     }

     const validatedFields = NewPasswordSchema.safeParse(values);

     if(!validatedFields.success){
          return {error: "Բոլոր դաշտերը վալիդացված չեն"}
     }

     const {password} = validatedFields.data
     
     const existingToken = await getPasswordResetTokenByToken(token);
     if(!existingToken){
          return {error: "Վերականգման token-ը գոյություն չունի կամ սխալ է։"}
     }

     const hasExpired = new Date(existingToken.expires) < new Date();
     if(hasExpired){
          return {error: "Վերականգման token-ի ժամկետը անցել է։"}
     }

     const existingUser = await getUserByEmail(existingToken.email);
     if(!existingUser){
          return {error: "Այս էլ․ հասցեն գրանցված չէ"}
     }

     const hashedPassword = await bcrypt.hash(password,10);

     await db.user.update({
          where: {
               id: existingUser.id
          },
          data: {
               password: hashedPassword
          }
     })
     await db.passwordResetToken.delete({
          where: {id: existingToken.id}
     })

     return {success: "Գաղտնաբառը թարմացված է"}
}