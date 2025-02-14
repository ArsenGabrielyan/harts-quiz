import { getQuizDetails } from "@/actions/quiz"
import QuizInfo from "@/components/client-components/quiz-info"
import { notFound } from "next/navigation"

export default async function SingleQuizPage({
     params,
}: {
     params: Promise<{ id: string }>
}){
     const {id} = await params
     const {quiz} = await getQuizDetails(id)
     if(!quiz) notFound();
     return (
          <QuizInfo quiz={quiz}/>
     )
}