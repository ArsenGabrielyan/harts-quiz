import { getCurrUser } from "@/actions/quiz";
import MainPage from "@/components/client-components/main-page";
import { QuizDocument } from "@/data/types";

export default async function Home() {
  const {user,questions} = await getCurrUser();
  return (
    <MainPage user={user} questions={questions as QuizDocument[] | null}/>
  )
}
