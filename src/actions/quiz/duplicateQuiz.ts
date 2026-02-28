"use server";
import { db } from "@/lib/db";
import { getQuizById } from "@/data/quiz";

export const duplicateQuiz = async (quizId: string) => {
     if(!quizId){
          return {error: "Հարցաշարի ID-ն բացակայում է"}
     }
     const quiz = await getQuizById(quizId);
     if(!quiz){
          return {error: "Հարցաշարը չի գտնվել"}
     }
     await db.$transaction(async tx=>{
          const newQuiz = await tx.hartsQuiz.create({
               data: {
                    name: `«${quiz.name}»-ի կրկնօրինակ`,
                    teacher: quiz.teacher,
                    teacherEmail: quiz.teacherEmail,
                    description: quiz.description,
                    visibility: quiz.visibility,
                    subject: quiz.subject
               }
          });
          for (const q of quiz.questions) {
               const newQuestion = await tx.question.create({
                    data: {
                         question: q.question,
                         timer: q.timer,
                         type: q.type,
                         points: q.points,
                         description: q.description,
                         quizId: newQuiz.id,
                         answers: {
                              create: q.answers.map(a => ({ text: a.text }))
                         }
                    },
                    include: { answers: true }
               });
               const correctAnswer = q.answers.find(a => a.id === q.correctAnswerId);
               if (correctAnswer) {
                    const index = q.answers.findIndex(a => a.id === correctAnswer.id);
                    await tx.question.update({
                         where: { id: newQuestion.id },
                         data: {
                              correctAnswerId: newQuestion.answers[index].id
                         }
                    });
               }
          }
     })
     return {success: "Հարցաշարը կրկնօրինակվել է"}
}