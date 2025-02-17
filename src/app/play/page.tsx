import MultiplayerQuizPlay from "@/components/quiz/multiplayer/play";
import { currentUser } from "@/lib/auth";

export default async function MultiplayerQuizPage({
     searchParams,
}: {
     searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}){
     const {code} = await searchParams;
     const user = await currentUser();
     return (
          <MultiplayerQuizPlay user={user} code={code as string}/>
     )
}