import { accountTypesEnum, quizVisibilities, quizTypes, subjectList } from "@/data/constants"
import * as z from "zod"

type AccountTypeEnum = typeof accountTypesEnum[number]["type"]
const ACC_TYPE_ENUM: [AccountTypeEnum, ...AccountTypeEnum[]] = [
     accountTypesEnum[0].type,
     ...accountTypesEnum.slice(1).map(p=>p.type)
]

type QuizVisibilityEnum = typeof quizVisibilities[number]["type"];
const QUIZ_VISIBILITY_ENUM: [QuizVisibilityEnum,...QuizVisibilityEnum[]] = [
     quizVisibilities[0].type,
     ...quizVisibilities.slice(1).map(p=>p.type)
]

type QuestionTypeEnum = typeof quizTypes[number]["type"];
const QUESTION_TYPE_ENUM: [QuestionTypeEnum,...QuestionTypeEnum[]] = [
     quizTypes[0].type,
     ...quizTypes.slice(1).map(p=>p.type)
]

type SubjectNameEnum = typeof subjectList[number]["name"];
const SUBJECT_NAME_ENUM: [SubjectNameEnum,...SubjectNameEnum[]] = [
     subjectList[0].name,
     ...subjectList.slice(1).map(p=>p.name)
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