"use server";
import { db } from "@/lib/db";
import { getQuizById } from "@/data/db/quiz";

export const duplicateQuiz = async (quizId: string) => {
     if(!quizId){
          return {error: "Հարցաշարի ID-ն բացակայում է"}
     }
     const quiz = await getQuizById(quizId);
     if(!quiz){
          return {error: "Հարցաշարը չի գտնվել"}
     }
     const {name,teacher,teacherEmail,description,questions,visibility,subject} = quiz;
     await db.hartsQuiz.create({
          data: {
               name: `«${name}»-ի կրկնօրինակ`,
               teacher,
               teacherEmail,
               description,
               questions,
               visibility,
               subject
          }
     })
     return {success: "Հարցաշարը կրկնօրինակվել է"}
}