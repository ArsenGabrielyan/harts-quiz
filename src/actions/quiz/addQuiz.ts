"use server"
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { QuizEditorSchema } from "@/schemas"
import * as z from "zod"

export const addQuiz = async (values: z.infer<typeof QuizEditorSchema>): Promise<{
     error?: string,
     success?: string,
     quizId?: string
}> => {
     const validatedFields = QuizEditorSchema.safeParse(values);

     if(!validatedFields.success){
          return {error: "Բոլոր դաշտերը վալիդացրած չեն"}
     }
     const {name,subject,visibility,questions,description} = validatedFields.data;
     const currUser = await currentUser();
     if(!currUser){
          return {error: "Այս օգտատերը մուտք գործած չէ"}
     }
     if(currUser.accountType==="student"){
          return {error: "Միայն ուսուցիչը կամ անձնական հաշիվը կարող է ստեղծել հարցաշարեր"}
     }
     const createdQuiz = await db.hartsQuiz.create({
          data: {
               name,
               teacher: currUser.name as string,
               teacherEmail: currUser.email as string,
               description,
               questions,
               visibility,
               subject
          }
     })
     return {success: "Հարցաշարը ավելացված է", quizId: createdQuiz.id}
}