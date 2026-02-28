import { getQuizDetails } from "@/actions/quiz";
import QuizEditorForm from "@/components/quiz-editor/quiz-editor-form";
import { QuizDocument } from "@/lib/types";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function QuizEditorPage({
     searchParams,
}: {
     searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}){
     const {id} = await searchParams;
     const user = await currentUser();
     const quizData = !id ? null : await getQuizDetails(id as string);
     if(user?.accountType==="student") redirect("/");
     return (
          <QuizEditorForm currQuiz={quizData?.quiz as QuizDocument || null}/>
     )
}