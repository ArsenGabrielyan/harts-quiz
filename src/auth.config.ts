import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import { validateUser } from "./actions/auth/validateUser"
 
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
                    const user = await validateUser(credentials);
                    return user;
               }
          })
     ]
} satisfies NextAuthConfig