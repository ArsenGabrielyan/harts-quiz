import { getCurrUser } from "@/actions/quiz";
import MainPage from "@/components/client-components/main-page";

export default async function Home() {
  const {user,questions} = await getCurrUser();
  return (
    <MainPage user={user} questions={questions}/>
  )
}
