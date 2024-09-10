import FeedLayout from "@/components/feed/FeedLayout";
import Button, { BtnLink } from "@/components/formComponents/button";
import User from "@/model/User";
import { getSession } from "next-auth/react"
import Image from "next/image";
import ReactNiceAvatar from "react-nice-avatar";
import { accTypeInArmenian, fetcher, getSubjectInArmenian } from "@/lib/helpers";
import HartsQuiz from "@/model/Quiz";
import QuestionItem from "@/components/feed/questionItem";
import { toast } from "react-toastify";
import connectDB from "@/lib/tools/connectDb";
import { useState } from "react";
import useSWR from "swr";
import Loader from "@/components/Loader";
import { ThreeDots } from "react-loader-spinner";

export default function UserInfo({session, questions, id}){
     const {data: user, isLoading, isValidating} = useSWR(`/api/users?id=${id}`,fetcher)
     const [postsCount, setPostsCount] = useState(12)
     const shareProfile = async() => {
          const shareData = {
               title: 'Հարց',
               text: `${user.name}-ը Հարց Հավելվածում`,
               url: location.href
          }
          if(navigator.canShare(shareData)) await navigator.share(shareData)
          else {
               navigator.clipboard.writeText(location.href);
               toast.success('Հղումը պատճենված է');
          }
     }
     return <FeedLayout>
          {isLoading ? <Loader /> : <section>
               <div className="user-header">
                    <div className="info">
                         {typeof user.image === 'string' ? <Image src={user.image} alt="pfp" className="pfp" width={150} height={150} /> : <ReactNiceAvatar className="pfp" {...user.image} />}
                         <div className="user-details">
                              <h1>{user.name}{isValidating && <ThreeDots width={32} height={32} color="#222" />}</h1>
                              <p>@{user.username}</p>
                              <p>{accTypeInArmenian(user.accountType)}</p>
                              {user.showFavoriteSubject && <p>Սիրած առարկա՝ {getSubjectInArmenian(user.favoriteSubject)}</p>}
                              {user.accountType!=='student' && <p><strong>{questions.length}</strong> Հարցաշար</p>}
                         </div>
                    </div>
                    <div className="options">
                         <Button onClick={shareProfile} btnStyle="outline-blue">Կիսվել</Button>
                         {session?.user?.email===user.email && <>
                              <BtnLink href="/settings" btnStyle="outline-blue">Կարգավորումներ</BtnLink>
                              {session?.user?.accountType!=='student' && <BtnLink href="/library" btnStyle="outline-blue">Բոլոր Հարցաշարերը</BtnLink>}
                         </>}
                    </div>
               </div>
               {user?.bio!=="" && <>
                    <h2 className="title mt">Նկարագրություն</h2>
                    <p>{user?.bio}</p>
               </>}
               {(questions && questions.length!==0) && <>
                    <h2 className="title mt">Հարցաշարեր</h2>
                    <div className="questions">
                         {questions.slice(0,postsCount).map(question=><QuestionItem key={question.id} data={question} session={session} />)}
                    </div>
                    {postsCount<=questions.length && <Button btnStyle="outline-white" onClick={()=>setPostsCount(prev=>prev+12)}>Բեռնել Ավելին</Button>}
               </>}
          </section>}
     </FeedLayout>
}
export const getServerSideProps = async ctx => {
     await connectDB();
     const session = await getSession(ctx);
     const {id} = ctx.query
     const user = JSON.parse(JSON.stringify(await User.findOne({userId: id}) || await User.findOne({username: id})));
     const questions = JSON.parse(JSON.stringify(await HartsQuiz.find({teacherEmail: user.email, visibility: 'public'})))
     return user ? {props: {session, questions: user.accountType!=='student' ? questions : null, id}} : {notFound: true}
}