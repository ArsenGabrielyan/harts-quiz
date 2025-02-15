"use server"
import * as z from "zod"
import { QuizEditorSchema } from "@/schemas"
import { connectDB } from "@/lib/mongodb/mongoose";
import { currentUser } from "@/lib/auth";
import HartsQuiz from "@/models/quiz";

export const editQuiz = async (values: z.infer<typeof QuizEditorSchema>, id: string) => {
     const validatedFields = QuizEditorSchema.safeParse(values);
     
     if(!validatedFields.success){
          return {error: "Բոլոր դաշտերը վալիդացրած չեն"}
     }
     await connectDB();
     const {name,subject,visibility,questions,description} = validatedFields.data;
     const currUser = await currentUser();
     if(!currUser){
          return {error: "Այս օգտատերը մուտք գործած չէ"}
     }
     if(currUser.accountType==="student"){
          return {error: "Միայն ուսուցիչը կամ անձնական հաշիվը կարող է ստեղծել հարցաշարեր"}
     }
     await HartsQuiz.findByIdAndUpdate(id,{
          $set: {
               name,
               teacher: currUser.name,
               teacherEmail: currUser.email,
               description,
               questions,
               visibility,
               subject
          }
     });
     return {success: "Հարցաշարը խմբագրված է"}
}