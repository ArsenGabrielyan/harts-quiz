"use server"
import { RegisterSchema } from "@/schemas"
import * as z from "zod"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/mongodb/mongoose"
import User from "@/models/user"
import { getUserByEmail, getUserByUsername } from "@/data/db/user"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"
import { generateUsername } from "@/data/helpers"

export const register = async (values: z.infer<typeof RegisterSchema>) => {
     const validatedFields = RegisterSchema.safeParse(values);

     if(!validatedFields.success){
          return {error: "Բոլոր դաշտերը վալիդացված չեն"}
     }
     await connectDB();
     const {email,password,name, username, accountType} = validatedFields.data;
     const hashedPassword = await bcrypt.hash(password,10);
     const existingUser = await getUserByEmail(email);
     if(existingUser){
          return {error: "Էլ․ հասցեն արդեն օգտագործված է"}
     }
     const existingUsername = await getUserByUsername(username);
     const newUsername = existingUsername ? generateUsername(username) : username
     const user = new User({
          name,
          email,
          password: hashedPassword,
          username: newUsername,
          accountType,
          isOauth: false,
     })
     await user.save()
     
     const verificationToken = await generateVerificationToken(email);
     await sendVerificationEmail(name,verificationToken.email,verificationToken.token)

     return {success: "Միայն մեկ քայլ է մնացել՝ հաստատեք Ձեր էլ․ փոստը"}
}