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

export const ContactSchema = z.object({
     name: z.string().min(2,"Անունը և ազգանունը պետք է ունենա առնվազն 2 տառ").max(100,"Անունը և ազգանունը շատ երկար է"),
     email: z.string().email("Մուտքագրեք վավերական էլ․ փոստ"),
     phone: z.string().regex(/^[0-9+() -]*$/,"Հեռախոսահամարը պետք է պարունակի միայն թվեր և նշաններ (+, -, (, ))").min(8, "Հեռախոսահամարը շատ կարճ է").max(20, "Հեռախոսահամարը շատ երկար է"),
     subject: z.string().min(1,"Մուտքագրեք հաղորդագրության թեմայի անունը").max(100, "Թեման շատ երկար է"),
     message: z.string().min(5, "Հաղորդագրությունը պետք է լինի առնվազն 5 տառ")
})