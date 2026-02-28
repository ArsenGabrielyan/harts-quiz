import { AccountType, QuestionType, QuizVisibility } from "@prisma/client";
import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { IconType } from "react-icons/lib";

// Themes
export type ThemeColors = "Zinc" | "Rose" | "Blue" | "Green" | "Orange";
export interface ThemeColorStateParams {
     themeColor: ThemeColors,
     setThemeColor: React.Dispatch<React.SetStateAction<ThemeColors>>
}

// Quiz Types
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

// Subjects
export enum SubjectName {
     NativeLang = "native-lang",
     Armenian = "armenian",
     Russian = "russian",
     English = "english",
     Literature = "literature",
     ForeignLang = "foreign-lang",
     ForeignLiterature = "foreign-literature",
     Algebra = "algebra",
     Geometry = "geometry",
     Maths = "maths",
     Arithmetics = "arithmetics",
     AdvancedMaths = "advanced-maths",
     Physics = "physics",
     Chemistry = "chemistry",
     Science = "science",
     Geography = "geography",
     Astronomy = "astronomy",
     Biology = "biology",
     Informatics = "informatics",
     PE = "pe",
     Health = "health",
     Music = "music",
     MilStudies = "military-studies",
     Chess = "chess",
     History = "history",
     SocialStudies = "social-studies",
     Tech = "technology",
     ReligiousStudies = "religious-studies",
     Art = "art",
     Reading = "reading",
     Other = "others"
}
export interface ISubject {
     name: SubjectName,
     title: string,
     type: "Հումանիտար" | "Մաթեմատիկական" | "Բնագիտական" | "Սպորտ և Առողջ Ապրելակերպ" | "Արվեստ և Արհեստ" | "Ուրիշ Առարկաներ"
}

// States
export interface IOnePlayerQuizState {
     startTimer: number,
     currIdx: number,
     correct: number,
     wrong: number,
     points: number,
     phase: Exclude<QuizPhase,"leaderboard"|"waiting"> | "result",
     correctText: string | null
}
export interface IQuestionState {
     currTime: number,
     currAnswerId: number | null,
}
export interface IMultiplayerHostState {
     currIdx: number,
     users: IQuizUser[],
     isStarted: boolean,
     startTimer: number,
     placements: IQuizPlacement[],
     showPlacements: boolean,
     phase: QuizPhase
}
export interface IMultiplayerPlayState {
     isStarted: boolean,
     startTimer: number,
     currQuiz: QuizDocument | null,
     currIdx: number,
     place: number,
     formData: IQuizUser,
     phase: QuizPhase
}

// Other
export interface ISelectData<T> {
     type: T,
     name: string,
     Icon: (ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>) | IconType
}
export interface INameIcon {
     name: string,
     Icon: (ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>) | IconType
}