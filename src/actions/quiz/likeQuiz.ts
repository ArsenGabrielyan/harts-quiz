"use server"
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth"
import { getUserById } from "@/data/db/user";

export const likeQuiz = async (quizId: string) => {
     const user = await currentUser();
     if(!user){
          return {error: "Այս օգտագործողը մուտք չի գործել"}
     }
     const existingUser = await getUserById(user.id as string)
     if(!existingUser){
          return {error: "Այս օգտագործողը չի գտնվել"}
     }
     const isLiked = existingUser.favorites.includes(quizId);
     if(isLiked){
          await db.user.update({
               where: {id: existingUser.id},
               data: {
                    favorites: {
                         push: quizId
                    }
               }
          })
     } else {
          await db.user.update({
               where: {id: existingUser.id},
               data: {
                    favorites: existingUser.favorites.filter(val=>val!==quizId)
               }
          })
     }
     return {success: "Հարցաշարը հավանվել է"}
}