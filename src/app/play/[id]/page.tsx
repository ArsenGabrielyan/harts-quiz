import { getQuizDetails } from "@/actions/quiz";
import OnePlayerQuiz from "@/components/quiz/one-player-quiz";
import { QuizDocument } from "@/lib/types";
import { currentUser } from "@/lib/auth";
import { notFound } from "next/navigation";

export default async function OnePlayerQuizPage({
     params
}: {
     params: Promise<{ id: string }>
}){
     const {id} = await params;
     const user = await currentUser();
     const {quiz} = await getQuizDetails(id,user);
     if(!quiz) notFound();
     return (
          <OnePlayerQuiz quiz={quiz as QuizDocument} user={user}/>
     )
}