import TwoFactorConfirmation from "@/models/two-factor-confirmation";

export const getTwoFactorConfirmationByUserId = async(userId: string) => {
     try{
          const twoFactorConfirmation = await TwoFactorConfirmation.findOne({userId});
          return twoFactorConfirmation
     } catch {
          return null
     }
}