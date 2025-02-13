"use server"
import { getEveryQuizByVisibility, getQuizById } from "@/data/db/quiz";
import { QuizDocument } from "@/data/types/mongoose-document-types";
import { connectDB } from "@/lib/mongodb/mongoose"

export const getEveryQuiz = async () => {
     await connectDB();
     const quizzes = await getEveryQuizByVisibility("public");
     if(quizzes){
          const result = quizzes.map(val=>JSON.parse(JSON.stringify(val)));
          return {quizzes: result as QuizDocument[]}
     }
     return {quizzes: null}
}

export const getQuizDetails = async (id: string) => {
     await connectDB();
     const quiz = await getQuizById(id);
     return {quiz: JSON.parse(JSON.stringify(quiz))}
}