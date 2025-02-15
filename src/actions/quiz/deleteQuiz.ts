"use server";

import { connectDB } from "@/lib/mongodb/mongoose";
import HartsQuiz from "@/models/quiz";

export const deleteQuiz = async (quizId: string) => {
     if(!quizId){
          return {error: "Հարցաշարի ID-ն բացակայում է"}
     }
     await connectDB();
     await HartsQuiz.findByIdAndDelete(quizId);
     return {success: "Հարցաշարը ջնջվել է"}
}