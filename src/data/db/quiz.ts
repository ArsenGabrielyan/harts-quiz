import { QuizVisibility } from "@prisma/client";
import { db } from "@/lib/db";
import * as z from "zod"
import { QuizEditorSchema } from "@/schemas";

export async function getQuizById(id: string){
     try{
          const quiz = await db.hartsQuiz.findUnique({
               where: {id},
               include: {
                    questions: {
                         include: {
                              answers: true,
                              correctAnswer: true
                         }
                    }
               }
          })
          return quiz
     } catch {
          return null
     }
}

export async function getEveryQuizByTeacherEmail(email: string){
     try{
          const quiz = await db.hartsQuiz.findFirst({
               where: {
                    teacherEmail: email
               }
          })
          return quiz
     } catch {
          return null
     }
}

export async function getEveryQuizByVisibility(visibility: QuizVisibility){
     try{
          const quizzes = await db.hartsQuiz.findMany({
               where: {visibility}
          })
          return quizzes
     } catch {
          return null;
     }
}