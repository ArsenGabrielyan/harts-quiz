"use server"
import { auth } from "@/auth";
import { getEveryQuizByTeacherEmail, getEveryQuizByVisibility, getQuizById } from "@/data/db/quiz";
import { ExtendedUser } from "@/next-auth";

export const getEveryQuiz = async () => {
     const quizzes = await getEveryQuizByVisibility("public");
     if(quizzes){
          const result = quizzes.map(val=>JSON.parse(JSON.stringify(val)));
          return {quizzes: result}
     }
     return {quizzes: null}
}

export const getQuizDetails = async (id: string, user?: ExtendedUser) => {
     const quiz = await getQuizById(id);
     const isAuthenticated = user && user.email===quiz?.teacherEmail;
     if(!isAuthenticated && quiz?.visibility==="private") return {quiz: null}
     return {quiz: JSON.parse(JSON.stringify(quiz))}
}
export const getCurrUser = async() => {
     const session = await auth();
     if(session?.user){
          const questions = await getEveryQuizByVisibility("public");
          return {user: session?.user, questions: JSON.parse(JSON.stringify(questions))}
     }
     return {user: null, questions: null}
}
export const getQuizFromCurrEmail = async(email: string) => {
     const quizzes = await getEveryQuizByTeacherEmail(email);
     if(quizzes){
          return {quizzes: JSON.parse(JSON.stringify(quizzes))}
     }
     return {quizzes: null}
}