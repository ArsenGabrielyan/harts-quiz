import PassResetToken from "@/models/pass-reset-token";

export const getPasswordResetTokenByToken = async (token: string) => {
     try{
          const passwordResetToken = await PassResetToken.findOne({token})
          return passwordResetToken
     } catch{
          return null
     }
}

export const getPasswordResetTokenByEmail = async (email: string) => {
     try{
          const passwordResetToken = await PassResetToken.findOne({email})
          return passwordResetToken
     } catch{
          return null
     }
}