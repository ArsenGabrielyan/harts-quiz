"use server"
import { getUserByEmail } from "@/data/db/user"
import { getVerificationTokenByToken } from "@/data/db/verification-token"
import { connectDB } from "@/lib/mongodb/mongoose"
import EmailToken from "@/models/email-token"
import User from "@/models/user"

export const newVerification = async (token: string) => {
     await connectDB();
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


     await User.findByIdAndUpdate(existingUser._id,{
          $set: {
               emailVerified: new Date(),
               email: existingToken.email
          }
     })

     await EmailToken.findByIdAndDelete(existingToken._id)

     return {success: "Ձեր էլ․ փոստը հաջողությամբ հաստատվել է։"}
}