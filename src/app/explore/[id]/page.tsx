import { getQuizDetails } from "@/actions/quiz"
import QuizInfo from "@/components/client-components/quiz-info"
import { QuizDocument } from "@/data/types"
import { currentUser } from "@/lib/auth"
import { notFound } from "next/navigation"

export default async function SingleQuizPage({
     params,
}: {
     params: Promise<{ id: string }>
}){
     const user = await currentUser();
     const {id} = await params
     const {quiz} = await getQuizDetails(id,user)
     if(!quiz) notFound();
     return (
          <QuizInfo quiz={quiz as QuizDocument}/>
     )
}