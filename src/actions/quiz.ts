"use server"
import { auth } from "@/auth";
import { getEveryQuizByTeacherEmail, getEveryQuizByVisibility, getQuizById } from "@/data/db/quiz";
import { QuizDocument } from "@/data/types/mongoose-document-types";
import { connectDB } from "@/lib/mongodb/mongoose"
import HartsQuiz from "@/models/quiz";
import { ExtendedUser } from "@/next-auth";

export const getEveryQuiz = async (): Promise<{quizzes: QuizDocument[] | null}> => {
     await connectDB();
     const quizzes = await getEveryQuizByVisibility("public");
     if(quizzes){
          const result = quizzes.map(val=>JSON.parse(JSON.stringify(val)));
          return {quizzes: result}
     }
     return {quizzes: null}
}

export const getQuizDetails = async (id: string): Promise<{quiz: QuizDocument}> => {
     await connectDB();
     const quiz = await getQuizById(id);
     return {quiz: JSON.parse(JSON.stringify(quiz))}
}
export const getCurrUser = async(): Promise<{
     user: ExtendedUser | null,
     questions: QuizDocument[] | null
}> => {
     const session = await auth();
     if(session?.user){
          await connectDB();
          const questions = await HartsQuiz.find();
          return {user: session?.user, questions: JSON.parse(JSON.stringify(questions))}
     }
     return {user: null, questions: null}
}