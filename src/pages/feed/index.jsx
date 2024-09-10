import FeedLayout from "@/components/feed/FeedLayout";
import connectDB from "@/lib/tools/connectDb";
import { getSession, useSession } from "next-auth/react";
import User from "@/model/User";
import Button, { BtnLink } from "@/components/formComponents/button";
import Image from "next/image";
import { divideQuestionsBySubject, fetcher } from "@/lib/helpers";
import ReactNiceAvatar from "react-nice-avatar";
import Link from "next/link";
import QuestionItem from "@/components/feed/questionItem";
import Carousel from "react-multi-carousel";
import { RESPONSIVE_CARDS } from "@/lib/constants";
import useSWR from "swr";
import Loader from "@/components/Loader";

export default function FeedPage({user}){
     const {data, status} = useSession();
     const {data: questions, isLoading} = useSWR("/api/questions?visibility=public",fetcher)
     return <FeedLayout isAuth={status==='authenticated'}>
          {isLoading ? <Loader /> : <section>
               {status==='authenticated' ? <>
               <div className="profile">
                    {typeof user?.image==='string' ? <Image src={user?.image} alt="pfp" width={150} height={150} className="pfp"/> : <ReactNiceAvatar className="pfp" {...user?.image} />}
                    <div className="info">
                         <h1>Բարև {user?.name.split(" ")[0]}</h1>
                         <p>@{user?.username}</p>
                         <div className="btns">
                              {data?.user?.accountType!=='student' && <Button btnStyle="outline-blue">Բոլոր Հարցաշարերը</Button>}
                              <Button btnStyle="outline-blue">Կարգավորումներ</Button>
                         </div>
                    </div>
               </div>
               {divideQuestionsBySubject(questions).map((val,i)=><div className="subject" key={i}>
                    <h2>{val.title}</h2>
                    <Carousel className="questions" infinite responsive={RESPONSIVE_CARDS}>
                         {val.data.map(v=><QuestionItem key={v.id} data={v} session={data}/>)}
                    </Carousel>
               </div>)}
               <p className="txt">Բոլոր Հարցաշարերը ուսումնասիրելու համար սեղմել <Link href="/feed/explore">այստեղ</Link></p>
               </> : <div className="hero">
                    <h1>Բարի Գալուստ Հարց</h1>
                    <p>Հավելված, որով դուք կզարգացնեք ձեր միտքը</p>
                    <div className="links">
                         <BtnLink href="/" btnStyle="white">Խաղալ</BtnLink>
                         <BtnLink href="/feed/explore" btnStyle="outline-white">Ուսումնասիրել</BtnLink>
                    </div>
               </div>}
          </section>}
     </FeedLayout>
}
export const getServerSideProps = async ctx => {
     await connectDB();
     const session = await getSession(ctx);
     const user = await User.findOne({email: session?.user?.email});
     if(user && user.isAccountNew) return {
          redirect: {
               destination: session?.user?.isOauth ? "/welcome/oauth" : '/welcome',
               permanent: false,
          },
     }
     return {props: {user: JSON.parse(JSON.stringify(user))}}
}