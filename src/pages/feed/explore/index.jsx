import FeedLayout from "@/components/feed/FeedLayout";
import connectDB from "@/lib/tools/connectDb";
import { getSession } from "next-auth/react";
import User from "@/model/User";
import { useMemo, useState } from "react";
import QuestionItem from "@/components/feed/questionItem";
import { subjectList } from "@/lib/constants";
import DiscoverFilter from "@/components/feed/DiscoverFilter";
import Button from "@/components/formComponents/button"
import useSWR from "swr";
import { fetcher } from "@/lib/helpers";
import Loader from "@/components/Loader";

export default function Explore({session}){
     const [postCount, setPostCount] = useState(12)
     const [search, setSearch] = useState('');
     const [currSubject, setCurrSubject] = useState('');
     const {data: questions, isLoading} = useSWR("/api/questions?visibility=public",fetcher);
     const allQuestions = useMemo(()=>questions?.filter(val=>{
          if(currSubject==='') return true;
          return val.subject===currSubject
     }),[currSubject,questions]);
     return <FeedLayout search={search} setSearch={setSearch}>
          {isLoading ? <Loader /> : <section>
               <h1 className="title">Ուսումնասիրել</h1>
               <div className="subjects-discover">
                    <h2>Ուսումնասիրել ըստ առարկաների</h2>
                    <DiscoverFilter>
                         <li className={currSubject==='' ? 'active' : ''} onClick={()=>setCurrSubject('')}>Ցույց տալ բոլորը</li>
                         {subjectList.map((subject,i)=><li key={i} onClick={()=>setCurrSubject(subject.name)} className={currSubject===subject.name ? 'active' : ''}>{subject.title}</li>)}
                    </DiscoverFilter>
               </div>
               <div className="questions">
                    {allQuestions?.filter(val=>
                         val.name.toLowerCase().includes(search.toLowerCase()) ||
                         val.subject.toLowerCase().includes(search.toLowerCase()) ||
                         val.teacher.toLowerCase().includes(search.toLowerCase())
                    ).slice(0,postCount).map(v=><QuestionItem key={v.id} data={v} session={session}/>)}
               </div>
               {postCount<=allQuestions?.filter(val=>
                    val.name.toLowerCase().includes(search.toLowerCase()) ||
                    val.subject.toLowerCase().includes(search.toLowerCase()) ||
                    val.teacher.toLowerCase().includes(search.toLowerCase())
               ).length && <Button btnStyle="outline-white mt" onClick={()=>setPostCount(prev=>prev+12)}>Բեռնել Ավելին</Button>}
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
     return {props: {session}}
}