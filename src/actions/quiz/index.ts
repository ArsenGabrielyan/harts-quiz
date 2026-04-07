"use server"
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { getEveryQuizByTeacherEmail, getEveryQuizByVisibility, getExistingFavorites, getQuizById } from "@/data/quiz";
import { ExtendedUser } from "@/next-auth";

export const getQuizDetails = async (id: string, user?: ExtendedUser) => {
     const quiz = await getQuizById(id);
     if (!quiz) return { quiz: null };
     const isAuthenticated = user && user.email === quiz?.teacherEmail;
     if (!isAuthenticated) return { quiz: null }
     return { quiz }
}

export const getCurrUser = async () => {
     const session = await auth();
     if (session?.user) {
          const questions = await getEveryQuizByVisibility("public");
          return { user: session?.user, questions }
     }
     return { user: null, questions: null }
}

export const getQuizFromCurrEmail = async (email: string) => {
     const quizzes = await getEveryQuizByTeacherEmail(email);
     return { quizzes }
}

export const likeQuiz = async (quizId: string) => {
     const quiz = await getQuizById(quizId)
     if (!quiz) return { error: "Հարցաշարը չի գտնվել" };
     const user = await currentUser();
     if (!user) return { error: "Այս օգտագործողը մուտք չի գործել" };
     const existing = await getExistingFavorites(user.id ?? "",quiz.id);
     if (existing) {
          await db.favorite.delete({
               where: {
                    userId_quizId: {
                         userId: user.id!,
                         quizId: quiz.id
                    }
               }
          });
          return { success: "Հարցաշարը ջնջվել է հավանած հարցաշարերի ցուցակից" };
     }
     await db.favorite.create({
          data: { userId: user.id!, quizId: quiz.id }
     });
     return { success: "Հարցաշարը հավանվել է" };
};