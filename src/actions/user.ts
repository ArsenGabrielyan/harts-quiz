"use server"
import { getEveryQuizByTeacherEmail } from "@/data/quiz";
import { getUserById } from "@/data/user";

export const getUserDetails = async(id: string) => {
     const user = await getUserById(id);
     const questions = await getEveryQuizByTeacherEmail(user?.email as string);
     return { user, questions }
}