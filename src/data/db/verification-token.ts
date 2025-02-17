import EmailToken from "@/models/email-token";

export const getVerificationTokenByEmail = async (
     email: string
) => {
     try{
          const verificationToken = await EmailToken.findOne({email})
          return verificationToken
     } catch {
          return null
     }
}

export const getVerificationTokenByToken = async (
     token: string
) => {
     try{
          const verificationToken = await EmailToken.findOne({token})
          return verificationToken
     } catch {
          return null
     }
}