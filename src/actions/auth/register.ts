"use server"
import { RegisterSchema } from "@/lib/schemas"
import * as z from "zod"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { getUserByEmail, getUserByUsername } from "@/data/user"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"
import { generateUsername } from "@/lib/helpers"
import { RegisterType } from "@/lib/types/schema"

export const register = async (values: RegisterType) => {
     const validatedFields = RegisterSchema.safeParse(values);

     if(!validatedFields.success){
          return {error: "Բոլոր դաշտերը վալիդացված չեն"}
     }
     const {email,password,name, username, accountType} = validatedFields.data;
     const hashedPassword = await bcrypt.hash(password,10);
     const existingUser = await getUserByEmail(email);
     if(existingUser){
          return {error: "Էլ․ հասցեն արդեն օգտագործված է"}
     }
     const existingUsername = await getUserByUsername(username);
     const newUsername = existingUsername ? generateUsername(username) : username

     await db.user.create({
          data: {
               name,
               email,
               password: hashedPassword,
               username: newUsername,
               accountType,
          }
     })
     
     const verificationToken = await generateVerificationToken(email);
     await sendVerificationEmail(name,verificationToken.email,verificationToken.token)

     return {success: "Միայն մեկ քայլ է մնացել՝ հաստատեք Ձեր էլ․ փոստը"}
}