import { LoginSchema, MultiplayerQuizFormSchema, NewPasswordSchema, QuizEditorSchema, RegisterSchema, ResetSchema, SettingsSchema, SoundSwitchFormSchema, TextAnswerFormSchema } from "@/lib/schemas"
import * as z from "zod"
import { ENUM_ACCOUNT_TYPES, VISIBILITIES_LIST, QUIZ_TYPES_LIST, SUBJECT_LIST } from "../constants/others"

// Auth
export type SettingsType = z.infer<typeof SettingsSchema>
export type LoginType = z.infer<typeof LoginSchema>
export type NewPasswordType = z.infer<typeof NewPasswordSchema>
export type RegisterType = z.infer<typeof RegisterSchema>
export type ResetType = z.infer<typeof ResetSchema>

// Quiz
export type QuizEditorType = z.infer<typeof QuizEditorSchema>
export type SoundSwitchFormType = z.infer<typeof SoundSwitchFormSchema>
export type TextAnswerFormType = z.infer<typeof TextAnswerFormSchema>
export type MultiplayerQuizFormType = z.infer<typeof MultiplayerQuizFormSchema>

// Enums
type AccountTypeEnum = typeof ENUM_ACCOUNT_TYPES[number]["type"]
export const ACC_TYPE_ENUM: [AccountTypeEnum, ...AccountTypeEnum[]] = [
     ENUM_ACCOUNT_TYPES[0].type,
     ...ENUM_ACCOUNT_TYPES.slice(1).map(p=>p.type)
]

type QuizVisibilityEnum = typeof VISIBILITIES_LIST[number]["type"];
export const QUIZ_VISIBILITY_ENUM: [QuizVisibilityEnum,...QuizVisibilityEnum[]] = [
     VISIBILITIES_LIST[0].type,
     ...VISIBILITIES_LIST.slice(1).map(p=>p.type)
]

type QuestionTypeEnum = typeof QUIZ_TYPES_LIST[number]["type"];
export const QUESTION_TYPE_ENUM: [QuestionTypeEnum,...QuestionTypeEnum[]] = [
     QUIZ_TYPES_LIST[0].type,
     ...QUIZ_TYPES_LIST.slice(1).map(p=>p.type)
]

type SubjectNameEnum = typeof SUBJECT_LIST[number]["name"];
export const SUBJECT_NAME_ENUM: [SubjectNameEnum,...SubjectNameEnum[]] = [
     SUBJECT_LIST[0].name,
     ...SUBJECT_LIST.slice(1).map(p=>p.name)
]