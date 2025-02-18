import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { IconType } from "react-icons/lib";

// Themes
export type ThemeColors = "Zinc" | "Rose" | "Blue" | "Green" | "Orange";
export interface ThemeColorStateParams{
     themeColor: ThemeColors,
     setThemeColor: React.Dispatch<React.SetStateAction<ThemeColors>>
}

// Quiz Types
export type QuizVisibility = | "public" | "private" | "unlisted"
export interface IQuestion{
     question: string,
     answers: string[],
     correct: string,
     timer: number,
     type: QuestionType,
     points: number,
     description: string
}
export interface QuizDocument extends IQuiz{
     id: string,
     teacher: string,
     teacherEmail: string,
     createdAt: Date,
     updatedAt?: Date
}
export interface IQuiz{
     name: string,
     description: string,
     questions: IQuestion[],
     visibility: QuizVisibility,
     subject: SubjectName,
}
export interface ISelectedQuiz{
     question: IQuestion,
     index: number | null
}
export type QuestionType = "pick_one" | "true_false" | "text"

// Subjects
export type SubjectType = "Հումանիտար" | "Մաթեմատիկական" | "Բնագիտական" | "Սպորտ և Առողջ Ապրելակերպ" | "Արվեստ և Արհեստ" | "Ուրիշ Առարկաներ"
export type SubjectName = "mayreni" | "armenian" | "russian" | "english" | "literature" | "foreign-lang" | "foreign-literature" | "algebra" | "geometry" | "mathematics" | "arithmetics" | "advanced-math" | "physics" | "chemistry" | "natural-env" | "natural-history" | "geography" | "astronomy" | "biology" | "informatics" | "pe" | "health" | "music" | "nzp" | "chess" | "local-history" | "history" | "social-studies" | "technology" | "religious-studies" | "art" | "reading" | "others"
export interface ISubject{
     name: SubjectName,
     title: string,
     type: SubjectType
}

// Other
export type AccountType = "student" | "teacher" | "personal"
export interface ISelectData<T>{
     type: T,
     name: string,
     Icon: (ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>) | IconType
}
export interface INameIcon{
     name: string,
     Icon: (ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>) | IconType
}
export interface IQuizUser{
     name: string,
     quizId: string,
     userId: string,
     points: number,
     socketId: string
}
export interface IQuizPlacement{
     name: string,
     points: number,
     place: number
     userId: string,
}

// States
export interface IOnePlayerQuizState{
     isStarted: boolean,
     startTimer: number,
     currIdx: number,
     isNextRound: boolean,
     correct: number,
     wrong: number,
     points: number,
}
export interface IQuestionState{
     currTime: number,
     currAnswer: string,
}
export interface IMultiplayerHostState{
     currIdx: number,
     users: IQuizUser[],
     isStarted: boolean,
     startTimer: number,
     showLeaderBoard: boolean,
     isEnded: boolean,
     placements: IQuizPlacement[],
     showPlacements: boolean,
}
export interface IMultiplayerPlayState{
     isSubmitted: boolean,
     isStarted: boolean,
     startTimer: number,
     currQuiz: QuizDocument | null
     currIdx: number,
     isEnded: boolean,
     place: number,
     score: number,
     formData: IQuizUser
}
export interface UserDocument{
     id: string,
     name: string,
     email: string,
     username: string,
     organization: string,
     password: string,
     image: string,
     accountType: AccountType,
     emailVerified: Date,
     isTwoFactorEnabled: boolean,
     soundEffectOn: boolean,
     showFavoriteSubject: boolean,
     bio: string,
     favorites: string[],
     favoriteSubject: SubjectName,
     createdAt?: Date,
     updatedAt?: Date
}