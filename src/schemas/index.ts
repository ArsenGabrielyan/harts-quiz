import { accountTypesEnum } from "@/data/constants"
import * as z from "zod"

export const ResetSchema = z.object({
     email: z.string().email("Մուտքագրեք վավերական էլ․ փոստ"),
})

type AccountTypeEnum = typeof accountTypesEnum[number]["type"]
const ACC_TYPE_ENUM: [AccountTypeEnum, ...AccountTypeEnum[]] = [
     accountTypesEnum[0].type,
     ...accountTypesEnum.slice(1).map(p=>p.type)
]

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