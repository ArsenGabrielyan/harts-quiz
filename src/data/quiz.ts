import { QuizVisibility } from "@prisma/client";
import { db } from "@/lib/db";
import { cache } from "react";

export const getQuizById = cache(async(id: string) => {
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
})

export const getEveryQuizByTeacherEmail = cache(async(email: string) => {
     try{
          const quiz = await db.hartsQuiz.findMany({
               where: { teacherEmail: email },
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
})

export const getEveryQuizByVisibility = cache(async(visibility: QuizVisibility) => {
     try{
          const quizzes = await db.hartsQuiz.findMany({
               where: {visibility},
               include: {
                    questions: {
                         include: {
                              answers: true,
                              correctAnswer: true
                         }
                    }
               }
          })
          return quizzes
     } catch {
          return null;
     }
})

export const getExistingFavorites = cache(async(userId: string, quizId: string) => {
     try{
          return await db.favorite.findUnique({
               where: {
                    userId_quizId: {
                         userId,
                         quizId
                    }
               }
          })
     } catch {
          return null
     }
})