"use server"
import * as z from "zod"
import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/db/user";
import { sendVerificationEmail, sendTwoFactorEmail } from "@/lib/mail";
import { generateVerificationToken, generateTwoFactorToken } from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas"
import { AuthError } from "next-auth";
import { getTwoFactorTokenByEmail } from "@/data/db/two-factor-token";
import { getTwoFactorConfirmationByUserId } from "@/data/db/two-factor-confirmation";
import { db } from "@/lib/db";
import { LoginType } from "@/data/types/schema";

const authErrorMessages: Record<string, string> = {
     CredentialsSignin: "Սխալ էլ․ փոստ կամ գաղտնաբառ։",
     AccessDenied: "Դուք չեք կարող մուտք գործել։",
     Configuration: "Սխալ կոնֆիգուրացիա։",
     Verification: "Ստուգման սխալ։",
     OAuthSignin: "OAuth մուտք գործելու սխալ։",
     OAuthCallback: "OAuth-ի հետ կանչման սխալ։",
     OAuthCreateAccount: "OAuth հաշվի ստեղծման սխալ։",
     EmailCreateAccount: "Էլ․ փոստի հաշվին ստեղծման սխալ։",
     Callback: "Հետ կանչման սխալ։",
     OAuthAccountNotLinked: "Այս էլ․ փոստով արդեն կա հաշիվ, բայց այլ մուտքի մեթոդով։",
     SessionRequired: "Խնդրում ենք մուտք գործել՝ այս էջը դիտելու համար։",
     Default: "Մի բան սխալ տեղի ունեցավ։",
};

export const login = async (
     values: LoginType,
     callbackUrl?: string | null
) => {
     const validatedFields = LoginSchema.safeParse(values);

     if(!validatedFields.success){
          return {error: "Բոլոր դաշտերը վալիդացված չեն"}
     }

     const {email,password, code} = validatedFields.data;
     const existingUser = await getUserByEmail(email);

     if(!existingUser || !existingUser.email || !existingUser.password){
          return {error: "Այս էլ․ հասցեն գրանցված չէ"}
     }

     if(!existingUser.emailVerified) {
          const verificationToken = await generateVerificationToken(email);
          await sendVerificationEmail(
               existingUser.name,
               verificationToken.email,
               verificationToken.token
          )

          return {success: "Հաստատեք Ձեր Էլ․ Հասցեն"}
     }

     if(existingUser.isTwoFactorEnabled && existingUser.email){
          if(code){
               const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
               if(!twoFactorToken || twoFactorToken.token!==code){
                    return {error: "Վավերացման կոդը սխալ է"}
               }

               const hasExpired = new Date(twoFactorToken.expires) < new Date();
               if(hasExpired){
                    return {error: "Վավերացման կոդի ժամկետը անցել է։"}
               }

               await db.twoFactorToken.delete({
                    where: {id: twoFactorToken.id}
               })

               const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
               if(existingConfirmation){
                    await db.twoFactorConfirmation.delete({
                         where: {id: existingConfirmation.id}
                    })
               }

               await db.twoFactorConfirmation.create({
                    data: {
                         userId: existingUser.id
                    }
               })
          } else {
               const twoFactorToken = await generateTwoFactorToken(existingUser.email);
               await sendTwoFactorEmail(
                    existingUser.name,
                    twoFactorToken.email,
                    twoFactorToken.token
               )
     
               return {twoFactor: true}
          }
     }

     try{
          await signIn("credentials",{
               email,
               password,
               redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT
          })
     } catch(error: unknown){
          if (error instanceof AuthError){
               return {error: authErrorMessages[error.type] || authErrorMessages.Default}
          }
          throw error
     }
}