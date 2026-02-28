import QuizList from "@/components/client-components/quiz-list";
import { getEveryQuizByVisibility } from "@/data/quiz";
import { QuizDocument } from "@/lib/types";

export default async function ExplorePage(){
     const quizzes = await getEveryQuizByVisibility("public")
     return (
          <QuizList quizzes={quizzes as QuizDocument[]}/>
     )
}