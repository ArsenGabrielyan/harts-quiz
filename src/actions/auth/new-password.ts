"use server"
import * as z from "zod"
import { NewPasswordSchema } from "@/schemas"
import { connectDB } from "@/lib/mongodb/mongoose"
import { getPasswordResetTokenByToken } from "@/data/db/password-reset-token"
import { getUserByEmail } from "@/data/db/user"
import bcrypt from "bcryptjs"
import User from "@/models/user"
import PasswordResetToken from "@/models/pass-reset-token"

export const newPassword = async(
     values: z.infer<typeof NewPasswordSchema>,
     token: string | null
) => {
     if(!token){
          return {error: "Բացակայում է վերականգման token-ը"}
     }

     const validatedFields = NewPasswordSchema.safeParse(values);

     if(!validatedFields.success){
          return {error: "Բոլոր դաշտերը վալիդացված չեն"}
     }

     await connectDB();
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

     await User.findByIdAndUpdate(existingUser._id,{
          $set: {password: hashedPassword}
     })

     await PasswordResetToken.findByIdAndDelete(existingToken._id)

     return {success: "Գաղտնաբառը թարմացված է"}
}