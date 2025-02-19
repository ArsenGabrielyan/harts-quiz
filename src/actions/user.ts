"use server"
import { getEveryQuizByTeacherEmail } from "@/data/db/quiz";
import { getUserById } from "@/data/db/user";

export const getUserDetails = async(id: string) => {
     const user = await getUserById(id);
     const questions = await getEveryQuizByTeacherEmail(user?.email as string);
     return { user, questions }
}