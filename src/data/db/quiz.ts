import HartsQuiz from "@/model/quiz"
import { QuizVisibility } from "../types/other-types";

export async function getQuizById(id: string){
     try{
          const quiz = await HartsQuiz.findById(id);
          return quiz
     } catch {
          return null
     }
}

export async function getEveryQuizByTeacherEmail(email: string){
     try{
          const quiz = await HartsQuiz.find({teacherEmail: email})
          return quiz
     } catch {
          return null
     }
}

export async function getEveryQuizByVisibility(visibility: QuizVisibility){
     try{
          const quizzes = await HartsQuiz.find({visibility});
          return quizzes
     } catch {
          return null;
     }
}