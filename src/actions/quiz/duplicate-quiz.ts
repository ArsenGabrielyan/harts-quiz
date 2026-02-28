"use server";
import { db } from "@/lib/db";
import { getQuizById } from "@/data/quiz";

function resolveCorrectAnswerId(
     originalAnswers: { id: number; text: string }[],
     newAnswers: { id: number; text: string }[],
     originalCorrectAnswerId: number | null,
     type: string
): number | undefined {
     if (!originalCorrectAnswerId) return undefined;

     if (type === "pick_one") {
          // Find the index of the correct answer in the original, use same index in new
          const index = originalAnswers.findIndex(a => a.id === originalCorrectAnswerId);
          return index >= 0 ? newAnswers[index]?.id : undefined;
     }
     if (type === "true_false") {
          const correctText = originalAnswers.find(a => a.id === originalCorrectAnswerId)?.text;
          return newAnswers.find(a => a.text === correctText)?.id;
     }
     // text — single answer record
     return newAnswers[0]?.id;
}

export const duplicateQuiz = async (quizId: string) => {
     if (!quizId) {
          return { error: "Հարցաշարի ID-ն բացակայում է" }
     }
     const quiz = await getQuizById(quizId);
     if (!quiz) {
          return { error: "Հարցաշարը չի գտնվել" }
     }

     await db.$transaction(async tx => {
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
               // For text questions the single answer holds the correct answer text
               const answerRows = q.type === "text"
                    ? q.answers.filter(a => a.id === q.correctAnswerId).map(a => ({ text: a.text }))
                    : q.answers.map(a => ({ text: a.text }));

               const newQuestion = await tx.question.create({
                    data: {
                         question: q.question,
                         timer: q.timer,
                         type: q.type,
                         points: q.points,
                         description: q.description,
                         quizId: newQuiz.id,
                         answers: { create: answerRows }
                    },
                    include: { answers: true }
               });

               const correctAnswerId = resolveCorrectAnswerId(
                    q.answers,
                    newQuestion.answers,
                    q.correctAnswerId,
                    q.type
               );

               if (correctAnswerId !== undefined) {
                    await tx.question.update({
                         where: { id: newQuestion.id },
                         data: { correctAnswerId }
                    });
               }
          }
     });

     return { success: "Հարցաշարը կրկնօրինակվել է" }
}