import { getQuizDetails } from "@/actions/quiz";
import MultiplayerQuizHost from "@/components/quiz/multiplayer/host";
import { currentUser } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";

export default async function HostQuizPage({
     searchParams,
}: {
     searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}){
     const {id} = await searchParams;
     const user = await currentUser();
     const {quiz} = await getQuizDetails(id as string,user)
     if(!user) redirect("/auth/login");
     if(user.accountType==="student") redirect("/explore");
     if(!quiz) notFound();
     return (
          <MultiplayerQuizHost quiz={quiz}/>
     )
}