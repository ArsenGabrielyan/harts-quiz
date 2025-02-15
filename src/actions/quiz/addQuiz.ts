"use server"
import { currentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb/mongoose";
import HartsQuiz from "@/models/quiz";
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
     await connectDB();
     const {name,subject,visibility,questions,description} = validatedFields.data;
     const currUser = await currentUser();
     if(!currUser){
          return {error: "Այս օգտատերը մուտք գործած չէ"}
     }
     if(currUser.accountType==="student"){
          return {error: "Միայն ուսուցիչը կամ անձնական հաշիվը կարող է ստեղծել հարցաշարեր"}
     }
     const newQuiz = new HartsQuiz({
          name,
          teacher: currUser.name,
          teacherEmail: currUser.email,
          description,
          questions,
          visibility,
          subject
     })
     await newQuiz.save();
     return {success: "Հարցաշարը ավելացված է", quizId: newQuiz._id}
}