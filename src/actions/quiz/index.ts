"use server"
import { currentUser } from "@/lib/auth";
import { QuizEditorSchema } from "@/lib/schemas"
import * as z from "zod"
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { getEveryQuizByTeacherEmail, getEveryQuizByVisibility, getQuizById } from "@/data/quiz";
import { ExtendedUser } from "@/next-auth";
import { QuizEditorType } from "@/lib/types/schema";

export const getEveryQuiz = async () => {
     const quizzes = await getEveryQuizByVisibility("public");
     return {quizzes}
}
export const getQuizDetails = async (id: string, user?: ExtendedUser) => {
     const quiz = await getQuizById(id);
     const isAuthenticated = user && user.email===quiz?.teacherEmail;
     if(!isAuthenticated && quiz?.visibility==="private") return {quiz: null}
     return {quiz}
}
export const getCurrUser = async() => {
     const session = await auth();
     if(session?.user){
          const questions = await getEveryQuizByVisibility("public");
          return {user: session?.user, questions}
     }
     return {user: null, questions: null}
}
export const getQuizFromCurrEmail = async(email: string) => {
     const quizzes = await getEveryQuizByTeacherEmail(email);
     return {quizzes}
}
export const addQuiz = async (values: QuizEditorType): Promise<{
     error?: string,
     success?: string,
     quizId?: string
}> => {
     const validatedFields = QuizEditorSchema.safeParse(values);
     if(!validatedFields.success)
          return {error: "Բոլոր դաշտերը վալիդացրած չեն"}
     const {name,subject,visibility,questions,description} = validatedFields.data;
     const currUser = await currentUser();
     if(!currUser)
          return {error: "Այս օգտատերը մուտք գործած չէ"}
     if(currUser.accountType==="student")
          return {error: "Միայն ուսուցիչը կամ անձնական հաշիվը կարող է ստեղծել հարցաշարեր"}
     const createdQuiz = await db.$transaction(async (tx) => {
          const quiz = await tx.hartsQuiz.create({
               data: {
                    name,
                    teacher: currUser.name!,
                    teacherEmail: currUser.email!,
                    description,
                    visibility,
                    subject
               }
          });
          for (const q of questions) {
               const createdQuestion = await tx.question.create({
                    data: {
                         question: q.question,
                         timer: q.timer,
                         type: q.type,
                         points: q.points,
                         description: q.description,
                         quizId: createdQuiz.id,
                         answers: {
                              create: q.answers.map(a => ({ text: a.text }))
                         }
                    },
                    include: { answers: true }
               });
               const correctAnswerId = createdQuestion.answers[q.correct].id;
               await tx.question.update({
                    where: { id: createdQuestion.id },
                    data: { correctAnswerId }
               });
          }
          return quiz
     })
     return {success: "Հարցաշարը ավելացված է", quizId: createdQuiz.id}
}
export const editQuiz = async (values: QuizEditorType, id: string): Promise<{
     error?: string,
     success?: string,
     quizId?: string
}> => {
     const validatedFields = QuizEditorSchema.safeParse(values);
     if(!validatedFields.success){
          return {error: "Բոլոր դաշտերը վալիդացրած չեն"}
     }
     const {name,subject,visibility,questions,description} = validatedFields.data;
     const currUser = await currentUser();
     if(!currUser){
          return {error: "Այս օգտատերը մուտք գործած չէ"}
     }
     if(currUser.accountType==="student"){
          return {error: "Միայն ուսուցիչը կամ անձնական հաշիվը կարող է ստեղծել հարցաշարեր"}
     }
     await db.$transaction(async (tx) => {
          await tx.hartsQuiz.update({
               where: { id },
               data: {
                    name,
                    teacher: currUser.name as string,
                    teacherEmail: currUser.email as string,
                    description,
                    visibility,
                    subject
               }
          })
          await tx.question.deleteMany({ where: { quizId: id } });
          for (const q of questions) {
               const createdQuestion = await tx.question.create({
                    data: {
                         question: q.question,
                         timer: q.timer,
                         type: q.type,
                         points: q.points,
                         description: q.description,
                         quizId: id,
                         answers: {
                              create: q.answers.map(a => ({ text: a.text }))
                         }
                    },
                    include: { answers: true }
               });
               const correctAnswerId = createdQuestion.answers[q.correct].id;
               await tx.question.update({
                    where: { id: createdQuestion.id },
                    data: {
                         question: q.question,
                         timer: q.timer,
                         type: q.type,
                         points: q.points,
                         description: q.description,
                         quizId: id,
                         answers: {
                              create: q.answers.map(a => ({ text: a.text }))
                         },
                         correctAnswerId
                    }
               });
          }
     })
     return {success: "Հարցաշարը խմբագրված է"}
}
export const deleteQuiz = async (quizId: string) => {
     if(!quizId){
          return {error: "Հարցաշարի ID-ն բացակայում է"}
     }
     await db.hartsQuiz.delete({
          where: {id: quizId}
     })
     return {success: "Հարցաշարը ջնջվել է"}
}