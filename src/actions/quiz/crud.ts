"use server"
import { currentUser } from "@/lib/auth";
import { QuizEditorSchema } from "@/lib/schemas"
import { db } from "@/lib/db";
import { getQuizById } from "@/data/quiz";
import { QuizEditorType } from "@/lib/types/schema";
import { IAnswer } from "@/lib/types";

// Finds the DB answer ID that matches the form's correct.text
// Works for all question types: correct.text always holds the right answer text
function resolveCorrectAnswerId(
     correct: { id: number; text: string },
     createdAnswers: { id: number; text: string }[]
): number | undefined {
     return createdAnswers.find(a => a.text === correct.text)?.id;
}

// For duplicateQuiz: maps the old correctAnswerId to the equivalent new answer ID
function resolveCorrectAnswerIdFromDb(
     originalAnswers: IAnswer[],
     newAnswers: { id: number; text: string }[],
     correctAnswerId: number | null
): number | undefined {
     if (!correctAnswerId) return undefined;
     const correctText = originalAnswers.find(a => a.id === correctAnswerId)?.text;
     if (!correctText) return undefined;
     return newAnswers.find(a => a.text === correctText)?.id;
}

export const addQuiz = async (values: QuizEditorType): Promise<{
     error?: string,
     success?: string,
     quizId?: string
}> => {
     const validatedFields = QuizEditorSchema.safeParse(values);
     if (!validatedFields.success)
          return { error: "Բոլոր դաշտերը վալիդացրած չեն" }

     const { name, subject, visibility, questions, description } = validatedFields.data;
     const currUser = await currentUser();
     if (!currUser)
          return { error: "Այս օգտատերը մուտք գործած չէ" }
     if (currUser.accountType === "student")
          return { error: "Միայն ուսուցիչը կամ անձնական հաշիվը կարող է ստեղծել հարցաշարեր" }

     const createdQuiz = await db.$transaction(async (tx) => {
          const quiz = await tx.hartsQuiz.create({
               data: { name, teacher: currUser.name!, teacherEmail: currUser.email!, description, visibility, subject }
          });

          for (const q of questions) {
               // text questions: store only the correct answer as a single Answer row
               // pick_one / true_false: store all selectable options
               const answerRows = q.type === "text"
                    ? [{ text: q.correct.text }]
                    : q.answers.map(a => ({ text: a.text }));

               const createdQuestion = await tx.question.create({
                    data: {
                         question: q.question,
                         timer: q.timer,
                         type: q.type,
                         points: q.points,
                         description: q.description,
                         quizId: quiz.id,
                         answers: { create: answerRows }
                    },
                    include: { answers: true }
               });

               const correctAnswerId = resolveCorrectAnswerId(q.correct, createdQuestion.answers);
               if (correctAnswerId !== undefined) {
                    await tx.question.update({
                         where: { id: createdQuestion.id },
                         data: { correctAnswerId }   // number — matches Prisma Int
                    });
               }
          }

          return quiz;
     });

     return { success: "Հարցաշարը ավելացված է", quizId: createdQuiz.id }
}

export const editQuiz = async (values: QuizEditorType, id: string): Promise<{
     error?: string,
     success?: string,
     quizId?: string
}> => {
     const validatedFields = QuizEditorSchema.safeParse(values);
     if (!validatedFields.success)
          return { error: "Բոլոր դաշտերը վալիդացրած չեն" }

     const { name, subject, visibility, questions, description } = validatedFields.data;
     const currUser = await currentUser();
     if (!currUser)
          return { error: "Այս օգտատերը մուտք գործած չէ" }
     if (currUser.accountType === "student")
          return { error: "Միայն ուսուցիչը կամ անձնական հաշիվը կարող է ստեղծել հարցաշարեր" }

     await db.$transaction(async (tx) => {
          await tx.hartsQuiz.update({
               where: { id },
               data: { name, teacher: currUser.name!, teacherEmail: currUser.email!, description, visibility, subject }
          });

          // Cascade deletes answers too (onDelete: Cascade in schema)
          await tx.question.deleteMany({ where: { quizId: id } });

          for (const q of questions) {
               const answerRows = q.type === "text"
                    ? [{ text: q.correct.text }]
                    : q.answers.map(a => ({ text: a.text }));

               const createdQuestion = await tx.question.create({
                    data: {
                         question: q.question,
                         timer: q.timer,
                         type: q.type,
                         points: q.points,
                         description: q.description,
                         quizId: id,
                         answers: { create: answerRows }
                    },
                    include: { answers: true }
               });

               const correctAnswerId = resolveCorrectAnswerId(q.correct, createdQuestion.answers);
               if (correctAnswerId !== undefined) {
                    await tx.question.update({
                         where: { id: createdQuestion.id },
                         data: { correctAnswerId }
                    });
               }
          }
     });

     return { success: "Հարցաշարը խմբագրված է" }
}

export const deleteQuiz = async (quizId: string) => {
     if (!quizId)
          return { error: "Հարցաշարի ID-ն բացակայում է" }
     await db.hartsQuiz.delete({ where: { id: quizId } })
     return { success: "Հարցաշարը ջնջվել է" }
}

export const duplicateQuiz = async (quizId: string) => {
     if (!quizId)
          return { error: "Հարցաշարի ID-ն բացակայում է" }

     const quiz = await getQuizById(quizId);
     if (!quiz)
          return { error: "Հարցաշարը չի գտնվել" }

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

               const correctAnswerId = resolveCorrectAnswerIdFromDb(
                    q.answers,
                    newQuestion.answers,
                    q.correctAnswerId
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