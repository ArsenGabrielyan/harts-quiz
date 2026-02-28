import { getQuizFromCurrEmail } from "@/actions/quiz";
import LibraryQuizList from "@/components/client-components/library";
import { QuizDocument } from "@/lib/types";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LibraryPage(){
     const user = await currentUser();
     const {quizzes} = await getQuizFromCurrEmail(user?.email as string);
     if(user?.accountType==="student") redirect("/");
     return (
          <LibraryQuizList quizzes={quizzes as QuizDocument[] | null}/>
     )
}