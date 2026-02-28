"use server"
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth"

export const likeQuiz = async (quizId: string) => {
     const user = await currentUser();
     if (!user) return { error: "Այս օգտագործողը մուտք չի գործել" };
     const existing = await db.favorite.findUnique({
          where: {
               userId_quizId: {
                    userId: user.id!,
                    quizId
               }
          }
     });
     if (existing) {
          await db.favorite.delete({
               where: {
                    userId_quizId: {
                         userId: user.id!,
                         quizId
                    }
               }
          });
          return { success: "Հարցաշարը ջնջվել է հավանած հարցաշարերի ցուցակից" };
     }
     await db.favorite.create({
          data: { userId: user.id!, quizId }
     });
     return { success: "Հարցաշարը հավանվել է" };
};