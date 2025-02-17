"use server";

import { getQuizById } from "@/data/db/quiz";
import { connectDB } from "@/lib/mongodb/mongoose";
import HartsQuiz from "@/models/quiz";

export const duplicateQuiz = async (quizId: string) => {
     if(!quizId){
          return {error: "Հարցաշարի ID-ն բացակայում է"}
     }
     await connectDB();
     const quiz = await getQuizById(quizId);
     if(!quiz){
          return {error: "Հարցաշարը չի գտնվել"}
     }
     const {name,teacher,teacherEmail,description,questions,visibility,subject} = quiz;
     const newQuiz = new HartsQuiz({
          name: `«${name}»-ի կրկնօրինակ`,
          teacher,
          teacherEmail,
          description,
          questions,
          visibility,
          subject
     });
     await newQuiz.save();
     return {success: "Հարցաշարը կրկնօրինակվել է"}
}