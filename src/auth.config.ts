import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import { validateUser } from "./actions/auth/validateUser"
import { env } from "./lib/env"
 
export default { 
     providers: [
          Google({
               clientId: env.GOOGLE_ID,
               clientSecret: env.GOOGLE_SECRET,
          }),
          Facebook({
               clientId: env.FACEBOOK_ID,
               clientSecret: env.FACEBOOK_SECRET
          }),
          Credentials({
               async authorize(credentials) {
                    const user = await validateUser(credentials);
                    return user;
               }
          })
     ]
} satisfies NextAuthConfig