"use server"
import { getUserByEmail } from "@/data/db/user"
import { getVerificationTokenByToken } from "@/data/db/verification-token"
import { db } from "@/lib/db"

export const newVerification = async (token: string) => {
     const existingToken = await getVerificationTokenByToken(token);
     if(!existingToken){
          return {error: "Հաստատման token-ը գոյություն չունի կամ սխալ է։"}
     }

     const hasExpired = new Date(existingToken.expires) < new Date();
     if(hasExpired){
          return {error: "Հաստատման token-ի ժամկետը անցել է։"}
     }

     const existingUser = await getUserByEmail(existingToken.email);
     if(!existingUser){
          return {error: "Այս էլ․ հասցեն գրանցված չէ"}
     }

     await db.user.update({
          where: {
               id: existingUser.id
          },
          data: {
               emailVerified: new Date(),
               email: existingToken.email
          }
     })
     await db.verificationToken.delete({
          where: {
               id: existingToken.id
          }
     })

     return {success: "Ձեր էլ․ փոստը հաջողությամբ հաստատվել է։"}
}