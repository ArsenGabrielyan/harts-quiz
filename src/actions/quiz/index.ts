"use server"
import { currentUser } from "@/lib/auth";
import { QuizEditorSchema } from "@/lib/schemas"
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { getEveryQuizByTeacherEmail, getEveryQuizByVisibility, getQuizById } from "@/data/quiz";
import { ExtendedUser } from "@/next-auth";
import { QuizEditorType } from "@/lib/types/schema";

export const getEveryQuiz = async () => {
     const quizzes = await getEveryQuizByVisibility("public");
     return { quizzes }
}

export const getQuizDetails = async (id: string, user?: ExtendedUser) => {
     const quiz = await getQuizById(id);
     const isAuthenticated = user && user.email === quiz?.teacherEmail;
     if (!isAuthenticated && quiz?.visibility === "private") return { quiz: null }
     return { quiz }
}

export const getCurrUser = async () => {
     const session = await auth();
     if (session?.user) {
          const questions = await getEveryQuizByVisibility("public");
          return { user: session?.user, questions }
     }
     return { user: null, questions: null }
}

export const getQuizFromCurrEmail = async (email: string) => {
     const quizzes = await getEveryQuizByTeacherEmail(email);
     return { quizzes }
}

// Resolves the correctAnswerId after answers have been created in the DB.
// - pick_one: q.correct is a number index into the answers array
// - true_false: q.correct is "true" or "false" — match by text
// - text: q.correct is the answer text stored as the only answer (index 0)
function resolveCorrectAnswerId(
     q: QuizEditorType["questions"][number],
     createdAnswers: { id: number; text: string }[]
): number | undefined {
     if (q.type === "pick_one") {
          return createdAnswers[q.correct as number]?.id;
     }
     if (q.type === "true_false") {
          return createdAnswers.find(a => a.text === q.correct)?.id;
     }
     // text — correct answer was stored as the single answer record
     return createdAnswers[0]?.id;
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
               // For text questions the "answer" rows store the correct answer text.
               // For true_false / pick_one they store the selectable options.
               const answerRows = q.type === "text"
                    ? [{ text: q.correct as string }]
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

               const correctAnswerId = resolveCorrectAnswerId(q, createdQuestion.answers);
               await tx.question.update({
                    where: { id: createdQuestion.id },
                    data: { correctAnswerId }
               });
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
               data: { name, teacher: currUser.name as string, teacherEmail: currUser.email as string, description, visibility, subject }
          });

          // Delete existing questions (cascades to answers via onDelete: Cascade)
          await tx.question.deleteMany({ where: { quizId: id } });

          for (const q of questions) {
               const answerRows = q.type === "text"
                    ? [{ text: q.correct as string }]
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

               const correctAnswerId = resolveCorrectAnswerId(q, createdQuestion.answers);
               await tx.question.update({
                    where: { id: createdQuestion.id },
                    data: { correctAnswerId }
               });
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