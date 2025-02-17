import { v4 as uuidv4 } from "uuid"
import crypto from "crypto"
import { connectDB } from "./mongodb/mongoose";
import { getVerificationTokenByEmail } from "@/data/db/verification-token";
import { getPasswordResetTokenByEmail } from "@/data/db/password-reset-token";
import { getTwoFactorTokenByEmail } from "@/data/db/two-factor-token";
import TwoFactorToken from "@/models/two-factor-token";
import EmailToken from "@/models/email-token";
import PasswordResetToken from "@/models/pass-reset-token";

export const generateTwoFactorToken = async (email: string) => {
     const token = crypto.randomInt(100_000,1_000_000).toString();
     const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

     await connectDB();
     const existingToken = await getTwoFactorTokenByEmail(email);

     if(existingToken){
          await TwoFactorToken.findByIdAndDelete(existingToken._id)
     }

     const twoFactorToken = new TwoFactorToken({
          email,
          token,
          expires
     })
     await twoFactorToken.save();

     return twoFactorToken
}

export const generatePasswordResetToken = async (email: string) => {
     const token = uuidv4();
     const expires = new Date(new Date().getTime() + 3600 * 1000);

     await connectDB();
     const existingToken = await getPasswordResetTokenByEmail(email);

     if(existingToken){
          await PasswordResetToken.findByIdAndDelete(existingToken._id)
     }

     const passwordResetToken = new PasswordResetToken({
          email,
          token,
          expires
     })
     await passwordResetToken.save();

     return passwordResetToken
}

export const generateVerificationToken = async (email: string) => {
     const token = uuidv4();
     const expires = new Date(new Date().getTime() + 3600 * 1000);

     await connectDB();
     const existingToken = await getVerificationTokenByEmail(email)

     if(existingToken) {
          await EmailToken.findByIdAndDelete(existingToken._id)
     }
     const verificationToken = new EmailToken({
          email,
          token,
          expires
     })
     await verificationToken.save();
     return verificationToken
}