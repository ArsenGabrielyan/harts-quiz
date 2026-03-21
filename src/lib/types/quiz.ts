import { QuestionType, QuizVisibility } from "@prisma/client";
import { SubjectName } from "./subjects";

export interface IAnswer {
     id: number,
     text: string,
}
export interface IQuizDocumentQuestion {
     id: number,
     question: string,
     answers: IAnswer[],
     correctAnswerId: number | null,
     timer: number,
     type: QuestionType,
     points: number,
     description: string | null,
}
export interface IQuestion {
     question: string,
     answers: IAnswer[],
     correct: IAnswer | null
     timer: number,
     type: QuestionType,
     points: number,
     description: string | null,
}
export interface IQuiz {
     name: string,
     description: string | null,
     questions: IQuizDocumentQuestion[],
     visibility: QuizVisibility,
     subject: SubjectName,
}
export interface QuizDocument extends IQuiz {
     id: string,
     teacher: string,
     teacherEmail: string,
     createdAt: Date,
     updatedAt?: Date,
}
export interface IQuizUser {
     name: string,
     quizId: string,
     userId: string,
     points: number,
     socketId: string
}
export interface IQuizPlacement {
     name: string,
     points: number,
     place: number,
     userId: string,
}
export type QuizPhase = "lobby" | "waiting" | "countdown" | "question" | "leaderboard" | "ended"