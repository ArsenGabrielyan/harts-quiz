"use server"
import { LoginSchema } from "@/schemas"
import { getUserByEmail } from "@/data/db/user"
import bcrypt from "bcryptjs"

export const validateUser = async (credentials: Partial<Record<string, unknown>>) => {
     const validatedFields = LoginSchema.safeParse(credentials)
     
     if(validatedFields.success){
          const {email, password} = validatedFields.data;
          const user = await getUserByEmail(email);
          if(!user || !user.password) return null;
     
          const passwordsMatch = await bcrypt.compare(password,user.password);
     
          if(passwordsMatch) return user;
     }
     
     return null
}