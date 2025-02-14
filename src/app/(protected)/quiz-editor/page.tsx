import QuizEditorForm from "@/components/quiz-editor/quiz-editor-form";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function QuizEditorPage(){
     const user = await currentUser();
     if(user?.accountType==="student") redirect("/");
     return (
          <QuizEditorForm/>
     )
}