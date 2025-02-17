"use server"

import { currentUser } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb/mongoose";
import User from "@/models/user";

export const likeQuiz = async (quizId: string) => {
     const user = await currentUser();
     if(!user){
          return {error: "Այս օգտագործողը մուտք չի գործել"}
     }
     await connectDB();
     const existingUser = await User.findById(user.id);
     if(!existingUser){
          return {error: "Այս օգտագործողը չի գտնվել"}
     }
     const isLiked = existingUser.favorites.includes(quizId);
     if(isLiked){
          existingUser.favorites = existingUser.favorites.filter(fav=>fav!==quizId);
     } else {
          existingUser.favorites.push(quizId);
     }
     await existingUser.save();
     return {success: "Հարցաշարը հավանվել է"}
}