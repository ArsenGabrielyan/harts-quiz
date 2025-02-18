"use server";
import { db } from "@/lib/db";

export const deleteQuiz = async (quizId: string) => {
     if(!quizId){
          return {error: "Հարցաշարի ID-ն բացակայում է"}
     }
     await db.hartsQuiz.delete({
          where: {id: quizId}
     })
     return {success: "Հարցաշարը ջնջվել է"}
}