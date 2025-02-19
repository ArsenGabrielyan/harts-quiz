import { getQuizDetails } from "@/actions/quiz";
import OnePlayerQuiz from "@/components/quiz/one-player-quiz";
import { QuizDocument } from "@/data/types";
import { currentUser } from "@/lib/auth";
import { notFound } from "next/navigation";

export default async function OnePlayerQuizPage({
     params
}: {
     params: Promise<{ id: string }>
}){
     const {id} = await params;
     const {quiz} = await getQuizDetails(id);
     if(!quiz) notFound();
     const user = await currentUser();
     return (
          <OnePlayerQuiz quiz={quiz as QuizDocument} user={user}/>
     )
}