"use server"
import * as z from "zod";
import { SettingsSchema } from "@/schemas";
import { connectDB } from "@/lib/mongodb/mongoose";
import { getUserByEmail, getUserById, getUserByUsername } from "@/data/db/user";
import User from "@/models/user";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";
import { generateUsername } from "@/data/helpers";
import { getEveryQuizByTeacherEmail } from "@/data/db/quiz";
import HartsQuiz from "@/models/quiz";
import { signOut } from "@/auth";
import client from "@/lib/mongodb/db";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
     const user = await currentUser();
     if(!user){
          return {error: "Մուտք գործեք հաշվին"}
     }

     await connectDB();
     const dbUser = await getUserById(user.id!);
     if(!dbUser){
          return {error: "Մուտք գործեք հաշվին"}
     }

     if(user.isOauth){
          values.email = undefined;
          values.password = undefined;
          values.newPassword = undefined;
          values.isTwoFactorEnabled = undefined;
     }

     if(values.email && values.email !== user.email){
          const existingUser = await getUserByEmail(values.email);
          if(existingUser && existingUser._id!==user.id){
               return {error: "Էլ․ հասցեն արդեն օգտագործված է"}
          }
          const verificationToken = await generateVerificationToken(values.email);

          await sendVerificationEmail(
               values.name ? values.name : user.name!,
               verificationToken.email,
               verificationToken.token
          )

          values.email = verificationToken.email;
          return {success: "Հաստատեք Ձեր էլ․ հասցեն"}
     }

     if(values.username && values.username!==user.username){
          const existingUsername = await getUserByUsername(values.username);
          if(existingUsername && existingUsername._id!==user.id){
               return {
                    error: "Այս օգտանունը արդեն գրանցված է",
                    newUsername: generateUsername(values.username)
               }
          }
     }

     if(values.password && values.newPassword && dbUser.password){
          const passwordsMatch = bcrypt.compare(
               values.password,
               dbUser.password
          );
          if(!passwordsMatch){
               return {error: "Գաղտնաբառը սխալ է"}
          }
          const hashedPassword = await bcrypt.hash(values.newPassword,10);

          values.password = hashedPassword;
          values.newPassword = undefined;
     }

     await User.findByIdAndUpdate(user.id,{
          $set: {
               ...values
          }
     });

     return {success: "Կարգավորումները թարմացված են"}
}

export const deleteAccount = async (email: string) => {
     await connectDB();
     const user = await getUserByEmail(email);
     if(!user){
          return {error: "Այս օգտագործողը չի գրանցվել"}
     }
     const quizzes = await getEveryQuizByTeacherEmail(email);
     if(quizzes){
          await HartsQuiz.deleteMany({teacherEmail: email});
     }
     if(user.isOauth){
          const db = client.db("test");
          await db.collection("accounts").deleteOne({userId: user._id});
     }
     await User.deleteOne({email});
     await signOut({redirectTo: "/"});
     return {success: "Այս հաշիվը ջնջվել է։"}
}