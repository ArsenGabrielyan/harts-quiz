"use server"
import { currentUser } from "@/lib/auth";
import { QuizEditorSchema } from "@/lib/schemas"
import { db } from "@/lib/db";
import { getQuizById } from "@/data/quiz";
import { QuizEditorType } from "@/lib/types/schema";
import { IAnswer } from "@/lib/types";
import { Prisma } from "@prisma/client";

function normalize(s: string) {
     return s.trim().toLowerCase();
}
function resolveCorrectAnswerId(
     correct: { id: number; text: string },
     createdAnswers: { id: number; text: string }[]
): number | undefined {
     return createdAnswers.find(a => normalize(a.text) === normalize(correct.text))?.id;
}
function resolveCorrectAnswerIdFromDb(
     originalAnswers: IAnswer[],
     newAnswers: { id: number; text: string }[],
     correctAnswerId: number | null
): number | undefined {
     if (correctAnswerId == null) return undefined;
     const correctText = originalAnswers.find(a => a.id === correctAnswerId)?.text;
     if (!correctText) return undefined;
     return newAnswers.find(a => normalize(a.text) === normalize(correctText))?.id;
}

async function persistQuestions(tx: Prisma.TransactionClient, quizId: string, questions: QuizEditorType["questions"]){
     for (const q of questions) {
          const createdQuestion = await tx.question.create({
               data: {
                    question: q.question,
                    timer: q.timer,
                    type: q.type,
                    points: q.points,
                    description: q.description?.trim() || null,
                    quizId,
               }
          });
          const correctText =
               q.type === "pick_one"
                    ? (q.answers[q.correct.id]?.text ?? "")
                    : q.correct.text;
          const answerRows = q.type === "text"
               ? [{ text: correctText, questionId: createdQuestion.id }]
               : q.answers.map(a => ({
                    text: a.text,
                    questionId: createdQuestion.id
               }));

          const createdAnswers = await tx.answer.createMany({
               data: answerRows
          });
          const allAnswers = await tx.answer.findMany({
               where: { questionId: createdQuestion.id }
          });
          const correctId = resolveCorrectAnswerId(q.correct, allAnswers);
          if (correctId !== undefined) {
               await tx.question.update({
                    where: { id: createdQuestion.id },
                    data: { correctAnswerId: correctId }
               });
          }
     }
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
          await persistQuestions(tx,quiz.id,questions)
          return quiz;
     },{timeout: 20000});

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

     const quiz = await getQuizById(id);
     if (!quiz) return { error: "Հարցաշարը չի գտնվել" };
     if (quiz.teacherEmail !== currUser.email) return { error: "Դուք իրավունք չունեք խմբագրել այս հարցաշարը" };

     await db.$transaction(async (tx) => {
          await tx.hartsQuiz.update({
               where: { id },
               data: { name, teacher: currUser.name!, teacherEmail: currUser.email!, description, visibility, subject }
          });
          await tx.question.deleteMany({ where: { quizId: id } });
          await persistQuestions(tx,quiz.id,questions)
     },{timeout: 20000});

     return { success: "Հարցաշարը խմբագրված է", quizId: quiz.id }
}

export const deleteQuiz = async (quizId: string) => {
     if (!quizId) return { error: "Հարցաշարի ID-ն բացակայում է" }
     const user = await currentUser();
     if (!user) return { error: "Այս օգտագործողը մուտք չի գործել" };
     const quiz = await getQuizById(quizId);
     if (!quiz) return { error: "Հարցաշարը չի գտնվել" };
     if (quiz.teacherEmail !== user.email) return { error: "Դուք իրավունք չունեք ջնջել այս հարցաշարը" };
     await db.hartsQuiz.delete({ where: { id: quizId } })
     return { success: "Հարցաշարը ջնջվել է" }
}

export const duplicateQuiz = async (quizId: string) => {
     if (!quizId) return { error: "Հարցաշարի ID-ն բացակայում է" }
     const user = await currentUser();
     if (!user) return { error: "Այս օգտագործողը մուտք չի գործել" };
     const quiz = await getQuizById(quizId);
     if (!quiz) return { error: "Հարցաշարը չի գտնվել" };
     if (quiz.teacherEmail !== user.email) return { error: "Դուք իրավունք չունեք կրկնօրինակել այս հարցաշարը" };

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
               let answerRows: {text: string}[] = [];
               if (q.type === "text") {
                    const correct = q.answers.find(a => a.id === q.correctAnswerId);
                    if (!correct) continue;
                    answerRows = [{ text: correct.text }];
               } else {
                    answerRows = q.answers.map(a => ({ text: a.text }))
               };

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
     },{timeout: 20000});

     return { success: "Հարցաշարը կրկնօրինակվել է" }
}