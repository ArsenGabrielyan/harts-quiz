import { LoginSchema, MultiplayerQuizFormSchema, NewPasswordSchema, QuizEditorSchema, RegisterSchema, ResetSchema, SettingsSchema, SoundSwitchFormSchema, TextAnswerFormSchema } from "@/schemas"
import * as z from "zod"

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