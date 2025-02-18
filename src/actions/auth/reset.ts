"use server"
import * as z from "zod"
import { ResetSchema } from "@/schemas"
import { getUserByEmail } from "@/data/db/user"
import { sendPasswordResetEmail } from "@/lib/mail"
import { generatePasswordResetToken } from "@/lib/tokens"

export const reset = async (values: z.infer<typeof ResetSchema>) => {
     const validatedFields = ResetSchema.safeParse(values);

     if(!validatedFields.success){
          return {error: "Էլ․ հասցեն վալիդացված չէ։"}
     }
     const {email} = validatedFields.data;

     const existingUser = await getUserByEmail(email);
     if(!existingUser){
          return {error: "Այս էլ․ հասցեն գրանցված չէ։"}
     }

     const passwordResetToken = await generatePasswordResetToken(email);

     await sendPasswordResetEmail(
          existingUser.name,
          passwordResetToken.email,
          passwordResetToken.token
     )

     return {success: "Վերականգման հղումը ուղարկված է։"}
}