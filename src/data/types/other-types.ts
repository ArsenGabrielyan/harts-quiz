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
export type QuizVisibility = "" | "public" | "private" | "unlisted"
export interface IQuestion{
     question: string,
     answers?: string[],
     correct: string | null,
     image: string | null,
     timer: number,
     type: QuestionType,
     points: number,
     description: string
}
export interface IQuiz{
     name: string,
     description: string,
     questions: IQuestion[],
     visibility: QuizVisibility,
     subject: string,
}
export interface ISelectedQuiz{
     question: IQuestion,
     index: number | null
}
export type QuestionType = "pick-one" | "true-false" | "text-answer"

// Subjects
export type SubjectType = "Հումանիտար" | "Մաթեմատիկական" | "Բնագիտական" | "Սպորտ և Առողջ Ապրելակերպ" | "Արվեստ և Արհեստ" | "Ուրիշ Առարկաներ"
export interface ISubject{
     name: string,
     title: string,
     type: SubjectType
}

// Other
export type AccountType = "student" | "teacher" | "personal"
export interface IAccountType{
     type: AccountType,
     name: string,
     Icon: (ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>) | IconType
}