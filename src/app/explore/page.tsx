import { getEveryQuiz } from "@/actions/quiz";
import QuizList from "@/components/client-components/quiz-list";

export default async function ExplorePage(){
     const {quizzes} = await getEveryQuiz()
     return (
          <QuizList quizzes={quizzes}/>
     )
}