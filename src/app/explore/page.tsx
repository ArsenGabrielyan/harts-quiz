import { getEveryQuiz } from "@/actions/quiz";
import QuizList from "@/components/client-components/quiz-list";
import { QuizDocument } from "@/data/types";

export default async function ExplorePage(){
     const {quizzes} = await getEveryQuiz()
     return (
          <QuizList quizzes={quizzes as QuizDocument[]}/>
     )
}