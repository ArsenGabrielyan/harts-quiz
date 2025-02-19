import { ENUM_ACCOUNT_TYPES, VISIBILITIES_LIST, QUIZ_TYPES_LIST, SUBJECT_LIST } from "@/data/constants/others"
import * as z from "zod"

type AccountTypeEnum = typeof ENUM_ACCOUNT_TYPES[number]["type"]
const ACC_TYPE_ENUM: [AccountTypeEnum, ...AccountTypeEnum[]] = [
     ENUM_ACCOUNT_TYPES[0].type,
     ...ENUM_ACCOUNT_TYPES.slice(1).map(p=>p.type)
]

type QuizVisibilityEnum = typeof VISIBILITIES_LIST[number]["type"];
const QUIZ_VISIBILITY_ENUM: [QuizVisibilityEnum,...QuizVisibilityEnum[]] = [
     VISIBILITIES_LIST[0].type,
     ...VISIBILITIES_LIST.slice(1).map(p=>p.type)
]

type QuestionTypeEnum = typeof QUIZ_TYPES_LIST[number]["type"];
const QUESTION_TYPE_ENUM: [QuestionTypeEnum,...QuestionTypeEnum[]] = [
     QUIZ_TYPES_LIST[0].type,
     ...QUIZ_TYPES_LIST.slice(1).map(p=>p.type)
]

type SubjectNameEnum = typeof SUBJECT_LIST[number]["name"];
const SUBJECT_NAME_ENUM: [SubjectNameEnum,...SubjectNameEnum[]] = [
     SUBJECT_LIST[0].name,
     ...SUBJECT_LIST.slice(1).map(p=>p.name)
]

export const ResetSchema = z.object({
     email: z.string().email("Մուտքագրեք վավերական էլ․ փոստ"),
})

export const NewPasswordSchema = z.object({
     password: z.string().min(8,"Գաղտնաբառը պետք է ունենա առնվազն 8 նիշ")
})

export const LoginSchema = z.object({
     email: z.string().email("Մուտքագրեք վավերական էլ․ փոստ"),
     password: z.string().min(1,"Մուտքագրեք գաղտնաբառը մուտք գործելու համար"),
     code: z.optional(z.string())
})

export const RegisterSchema = z.object({
     name: z.string().min(2,"Մուտքագրեք ձեր անունը և ազգանունը").max(100,"Անունը և ազգանունը շատ երկար է"),
     email: z.string().email("Մուտքագրեք վավերական էլ․ փոստ"),
     username: z.string().min(2,"Մուտքագրեք ձեր օգտանունը").max(100,"օգտանունը շատ երկար է"),
     accountType: z.enum(ACC_TYPE_ENUM),
     password: z.string().min(8,"Գաղտնաբառը պետք է ունենա առնվազն 8 նիշ")
})

export const QuestionSchema = z.object({
     question: z.string().min(1, "Պարտադիր է լրացնել հարցը"),
     answers: z.array(z.string().min(1,"Պարտադիր է լրացնել պատասխանները")),
     correct: z.string().min(1,"Պարտադիր է ընտրել ճիշտ պատասխանը"),
     timer: z.number().int("Տևողությունը պետք է լինի ամբողջ թիվ").gte(0,"Տևողությունը պետք է լինի դրական").refine(val=>val!==0,"Տևողությունը պետք չէ լինի 0"),
     points: z.number().int("Միավորը պետք է լինի ամբողջ թիվ").gte(0,"Միավորը պետք է լինի դրական").refine(val=>val!==0,"Միավորը պետք չէ լինի 0"),
     type: z.enum(QUESTION_TYPE_ENUM),
     description: z.optional(z.string())
});

export const QuizEditorSchema = z.object({
     name: z.string().min(2,"Պարտադիր է լրացնել հարցաշարի անունը"),
     description: z.optional(z.string()),
     visibility: z.enum(QUIZ_VISIBILITY_ENUM),
     subject: z.enum(SUBJECT_NAME_ENUM),
     questions: z.array(QuestionSchema).nonempty("Ավելացնել մի քանի հարցեր հարցաշար ստեղծելու համար")
})

export const SettingsSchema = z.object({
     name: z.optional(z.string()),
     email: z.optional(z.string().email("Մուտքագրեք վավերական էլ․ փոստ")),
     username: z.optional(z.string()),
     organization: z.optional(z.string()),
     password: z.optional(z.string().min(8,"Գաղտնաբառը պետք է ունենա առնվազն 8 նիշ")),
     newPassword: z.optional(z.string().min(8,"Գաղտնաբառը պետք է ունենա առնվազն 8 նիշ")),
     accountType: z.enum(ACC_TYPE_ENUM),
     isTwoFactorEnabled: z.optional(z.boolean()),
     soundEffectOn: z.optional(z.boolean()),
     showFavoriteSubject: z.optional(z.boolean()),
     bio: z.optional(z.string()),
     favoriteSubject: z.enum(SUBJECT_NAME_ENUM)
})
.refine(data=>{
     if(data.password && !data.newPassword){
          return false
     }
     return true;
},{
     message: "Պարտադիր է գրել նոր գաղտնաբառ",
     path: ["newPassword"]
})
.refine(data=>{
     if(data.newPassword && !data.password){
          return false;
     }
     return true
},{
     message: "Պարտադիր է գրել գաղտնաբառ",
     path: ["password"]
})

export const SoundSwitchFormSchema = z.object({
     soundEffectOn: z.boolean(),
})

export const TextAnswerFormSchema = z.object({
     answer: z.string().min(1,"Խնդրում ենք մուտքագրել Ձեր պատասխանը։")
})

export const MultiplayerQuizFormSchema = z.object({
     quizCode: z.string().min(1,"Մուտքագրեք խաղի կոդը"),
     name: z.string().min(1,"Մուտքագրեք աշակերտի անունը"),
     soundEffectOn: z.boolean(),
})