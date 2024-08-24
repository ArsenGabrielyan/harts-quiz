import FeedLayout from "@/components/feed/FeedLayout";
import connectDB from "@/lib/tools/connectDb";
import { getSession } from "next-auth/react";
import User from "@/model/User";
import HartsQuiz from "@/model/Quiz";
import { useMemo, useState } from "react";
import QuestionItem from "@/components/feed/questionItem";
import { subjectList } from "@/lib/constants";
import DraggableTab from "@/components/feed/DraggableTab";
import Button from "@/components/formComponents/button"

export default function Explore({questions, session}){
     const [postCount, setPostCount] = useState(12)
     const [search, setSearch] = useState('');
     const [currSubject, setCurrSubject] = useState('');
     const allQuestions = useMemo(()=>questions.filter(val=>{
          if(currSubject==='') return true;
          return val.subject===currSubject
     }),[currSubject,questions]);
     return <FeedLayout search={search} setSearch={setSearch}>
          <section>
               <h1 className="title">Ուսումնասիրել</h1>
               <div className="subjects-discover">
                    <h2>Ուսումնասիրել ըստ առարկաների</h2>
                    <DraggableTab>
                         <li className={currSubject==='' ? 'active' : ''} onClick={()=>setCurrSubject('')}>Ցույց տալ բոլորը</li>
                         {subjectList.map((subject,i)=><li key={i} onClick={()=>setCurrSubject(subject.name)} className={currSubject===subject.name ? 'active' : ''}>{subject.title}</li>)}
                    </DraggableTab>
               </div>
               <div className="questions">
                    {allQuestions.filter(val=>
                         val.name.toLowerCase().includes(search.toLowerCase()) ||
                         val.subject.toLowerCase().includes(search.toLowerCase()) ||
                         val.teacher.toLowerCase().includes(search.toLowerCase())
                    ).slice(0,postCount).map(v=><QuestionItem key={v.id} data={v} session={session}/>)}
               </div>
               {postCount<=allQuestions.filter(val=>
                    val.name.toLowerCase().includes(search.toLowerCase()) ||
                    val.subject.toLowerCase().includes(search.toLowerCase()) ||
                    val.teacher.toLowerCase().includes(search.toLowerCase())
               ).length && <Button btnStyle="outline-white mt" onClick={()=>setPostCount(prev=>prev+12)}>Բեռնել Ավելին</Button>}
          </section>
     </FeedLayout>
}
export const getServerSideProps = async ctx => {
     await connectDB();
     const session = await getSession(ctx);
     const user = await User.findOne({email: session?.user?.email});
     const questions = JSON.parse(JSON.stringify(await HartsQuiz.find({visibility: 'public'})))
     if(user && user.isAccountNew) return {
          redirect: {
               destination: session?.user?.isOauth ? "/welcome/oauth" : '/welcome',
               permanent: false,
          },
     }
     return {props: {questions, session}}
}