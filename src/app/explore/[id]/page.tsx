import { getQuizDetails } from "@/actions/quiz"
import QuizInfo from "@/components/client-components/quiz-info"

export default async function SingleQuizPage({
     params,
}: {
     params: Promise<{ id: string }>
}){
     const {id} = await params
     const {quiz} = await getQuizDetails(id)
     return (
          <QuizInfo quiz={quiz}/>
     )
}