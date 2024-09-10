import FeedLayout from "@/components/feed/FeedLayout";
import useSWR from "swr";
import { getSession } from "next-auth/react";
import { fetcher } from "@/lib/helpers";
import LibraryQuiz from "@/components/libQuestion";
import { ThreeDots } from "react-loader-spinner";

export default function MyQuiz({session}){
     const {data: myQuizzes, isLoading, mutate: updateQuiz, isValidating} = useSWR(`/api/questions?email=${session?.user?.email}`,fetcher);
     const {data: currUser, mutate: updateUser} = useSWR(`/api/users?email=${session?.user?.email}`,fetcher)
     return <FeedLayout>
          <h1 className="library-title">Ձեր հարցաշարերը{isValidating && <ThreeDots width={32} height={32} color="#fafafa"/>}</h1>
          {!isLoading && <div className="lib-quiz-list">
               {myQuizzes.map(quizData=><LibraryQuiz key={quizData.id} data={quizData} currUser={currUser} session={session} updateUser={updateUser}updateQuiz={updateQuiz}/>)}
          </div>}
     </FeedLayout>
}
export const getServerSideProps = async(ctx)=>{
     const session = await getSession(ctx);
     if(session){
          if(session.user.accountType==='student'){
               return {redirect: {
                    destination: '/feed',
                    permanent: false,
               }}
          } else {
               return {props: {session}}
          }
     } else return {redirect: {
          destination: '/auth/signin',
          permanent: false,
     }}
}