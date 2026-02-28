import { getEveryQuiz } from "@/actions/quiz";
import QuizList from "@/components/client-components/quiz-list";
import { QuizDocument } from "@/lib/types";

export default async function ExplorePage(){
     const {quizzes} = await getEveryQuiz()
     return (
          <QuizList quizzes={quizzes as QuizDocument[]}/>
     )
}