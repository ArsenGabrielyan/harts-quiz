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
     answers?: string[],
     correct: string | null,
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