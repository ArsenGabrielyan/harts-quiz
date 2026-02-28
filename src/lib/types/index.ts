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

// Shape of an answer coming from the DB (Prisma)
export interface IAnswer {
     id: number,
     text: string,
}

// Shape of a question coming from the DB (Prisma)
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

// Runtime shape used during quiz playback
export interface IQuestion {
     question: string,
     answers: string[],   // just the answer texts
     correct: string,     // the correct answer text (not an index)
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

// Subjects
export type SubjectName = "mayreni" | "armenian" | "russian" | "english" | "literature" | "foreign-lang" | "foreign-literature" | "algebra" | "geometry" | "mathematics" | "arithmetics" | "advanced-math" | "physics" | "chemistry" | "natural-env" | "natural-history" | "geography" | "astronomy" | "biology" | "informatics" | "pe" | "health" | "music" | "nzp" | "chess" | "local-history" | "history" | "social-studies" | "technology" | "religious-studies" | "art" | "reading" | "others"
export interface ISubject {
     name: SubjectName,
     title: string,
     type: "Հումանիտար" | "Մաթեմատիկական" | "Բնագիտական" | "Սպորտ և Առողջ Ապրելակերպ" | "Արվեստ և Արհեստ" | "Ուրիշ Առարկաներ"
}

// States
export interface IOnePlayerQuizState {
     isStarted: boolean,
     startTimer: number,
     currIdx: number,
     isNextRound: boolean,
     correct: number,
     wrong: number,
     points: number,
}
export interface IQuestionState {
     currTime: number,
     currAnswer: string,
}
export interface IMultiplayerHostState {
     currIdx: number,
     users: IQuizUser[],
     isStarted: boolean,
     startTimer: number,
     showLeaderBoard: boolean,
     isEnded: boolean,
     placements: IQuizPlacement[],
     showPlacements: boolean,
}
export interface IMultiplayerPlayState {
     isSubmitted: boolean,
     isStarted: boolean,
     startTimer: number,
     currQuiz: QuizDocument | null,
     currIdx: number,
     isEnded: boolean,
     place: number,
     score: number,
     formData: IQuizUser,
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
export interface UserDocument {
     id: string,
     name: string,
     email: string,
     username: string | null,
     organization: string | null,
     password: string | null,
     image: string | null,
     accountType: AccountType,
     emailVerified: Date | null,
     isTwoFactorEnabled: boolean,
     soundEffectOn: boolean,
     showFavoriteSubject: boolean,
     bio: string | null,
     favorites: string[],
     favoriteSubject: SubjectName | null,
     createdAt?: Date,
     updatedAt?: Date,
}