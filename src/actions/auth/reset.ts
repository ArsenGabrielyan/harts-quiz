"use server"
import { ResetSchema } from "@/lib/schemas"
import { getUserByEmail } from "@/data/user"
import { sendPasswordResetEmail } from "@/lib/mail"
import { generatePasswordResetToken } from "@/lib/tokens"
import { ResetType } from "@/lib/types/schema"

export const reset = async (values: ResetType) => {
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