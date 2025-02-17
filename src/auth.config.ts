import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import { LoginSchema } from "@/schemas"
import { connectDB } from "@/lib/mongodb/mongoose"
import { getUserByEmail } from "@/data/db/user"
import bcrypt from "bcryptjs"
 
export default { 
     providers: [
          Google({
               clientId: process.env.GOOGLE_ID,
               clientSecret: process.env.GOOGLE_SECRET,
          }),
          Facebook({
               clientId: process.env.FACEBOOK_ID,
               clientSecret: process.env.FACEBOOK_SECRET
          }),
          Credentials({
               async authorize(credentials) {
                    const validatedFields = LoginSchema.safeParse(credentials)

                    if(validatedFields.success){
                         await connectDB()
                         const {email, password} = validatedFields.data;
                         const user = await getUserByEmail(email);
                         if(!user || !user.password) return null;

                         const passwordsMatch = await bcrypt.compare(password,user.password);

                         if(passwordsMatch) return user;
                    }

                    return null
               }
          })
     ]
} satisfies NextAuthConfig