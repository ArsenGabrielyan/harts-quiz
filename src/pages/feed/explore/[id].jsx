import Image from "next/image";
import { fetcher, getAnswerType, shareQuiz } from "@/lib/helpers";
import FeedLayout from "@/components/feed/FeedLayout";
import { getSession } from "next-auth/react";
import Button, { BtnLink } from "@/components/formComponents/button";
import connectDB from "@/lib/tools/connectDb";
import HartsQuiz from "@/model/Quiz";
import { MdDelete, MdEdit, MdFavorite, MdPrint, MdShare } from "react-icons/md";
import { BiDuplicate } from "react-icons/bi";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import useSWR from "swr";
import PrintQuiz from "@/components/feed/print-quiz";
import User from "@/model/User";

export default function SingleQuiz({quiz,session,teacherId}){
     const router = useRouter();
     const {data: currUser, mutate: updateUser} = useSWR(`/api/users?email=${session?.user?.email}`,fetcher)
     const duplicateQuiz = async()=>await toast.promise(axios.post("/api/questions",{reqType: 'duplicate',quizId: quiz.id}),{
          pending: "Հարցաշարը կրկնօրինակվում է։ Խնդրում ենք սպասել...",
          success: 'Հարցաշարը կրկնօրինակված է',
          error: "Չհաջողվեց կրկնօրինակել հարցաշարը"
     })
     const deleteQuiz = async() => {
          if(confirm("Վստա՞հ ես")){
               const res = await toast.promise(axios.delete(`/api/questions?id=${quiz.id}`),{
                    pending: 'Հարցաշարը ջնջվում է։ Խնդրում ենք սպասել...',
                    success: 'Հարցաշարը ջնջված է',
                    error: "Չհաջողվեց ջնջել հարցաշարը"
               })
               if(res.status===200) router.push("/library");
          }
     }
     const likeQuiz = async()=>{
          const res = await axios.patch("/api/questions",{email: session?.user?.email, quizId: quiz.id});
          if(res.status===200) await updateUser();
     }
     const isLiked = currUser?.favorites?.includes(quiz.id);
     return <FeedLayout>
          <section className="quiz-info">
               <div className="header">
                    <h1>{quiz.name}</h1>
                    <p className="author">Ստեղծող՝ <Link href={`/feed/users/${teacherId}`}>{quiz.teacher}</Link></p>
                    <p>{quiz.description}</p>
                    <div className="options">
                         <Button customClass="optBtn" title="Կիսվել" onClick={shareQuiz}><MdShare /></Button>
                         <Button customClass="optBtn" title="Տպել" onClick={()=>print()}><MdPrint /></Button>
                         {session && <>
                              <Button customClass={`optBtn ${isLiked ? 'active' : ''}`.trim()} title={isLiked ? 'Չհավանել' : 'Հավանել'} onClick={likeQuiz}><MdFavorite /></Button>
                              {session?.user?.email===quiz.teacherEmail && <>
                                   <Link href={`/quizEditor?quizId=${quiz.id}`} className="optBtn" title="Խմբագրել"><MdEdit /></Link>
                                   <Button customClass="optBtn" title="Կրկնօրինակել" onClick={duplicateQuiz}><BiDuplicate /></Button>
                                   <Button customClass="optBtn red" title="Ջնջել" onClick={deleteQuiz}><MdDelete /></Button>
                              </>}
                         </>}
                    </div>
                    <div className="links">
                         {!session?.user?.accountType ? null : session?.user?.accountType!=='personal' ? <BtnLink href={session?.user?.accountType==='student' ? `/?id=${quiz.id}` : `/quiz?id=${quiz.id}`} btnStyle="outline-blue">{session?.user?.accountType==='student' ? "Խաղալ" : "Կազմակերպել"}</BtnLink> : <>
                              <BtnLink href={`/?id=${quiz.id}`} btnStyle="outline-blue">Խաղալ</BtnLink>
                              <BtnLink href={`/quiz?id=${quiz.id}`} btnStyle="outline-blue">Կազմակերպել</BtnLink>
                         </>}
                         <BtnLink href={`/play/${quiz.id}`} btnStyle="outline-blue">Խաղալ Մենակ</BtnLink>
                    </div>
               </div>
               <h2>Հարցեր</h2>
               <div className="question-list">
                    {quiz.questions.map((val,i)=><div className="list-item" key={i}>
                         <div className="info">
                              <p className="q"><span>{i+1} - {getAnswerType(val.type)}.</span> {val.question}</p>
                              <p className="desc">{val.description}</p>
                              {val.type === 'pick-one' && <ul className="answers">
                                   {val.answers.map((answer,i)=>{
                                        const answers = ["Ա","Բ","Գ","Դ"];
                                        return <li key={i}>{answers[i]}. {answer}</li>
                                   })}
                              </ul>}
                              <p className="t">{val.timer} վայրկյան&nbsp;&middot;&nbsp;{val.points} Միավոր</p>
                         </div>
                         {val.image && <Image src={val.image} alt="thumb" width={150} height={100} style={{objectFit: 'cover'}}/>}
                    </div>)}
               </div>
               <PrintQuiz quiz={quiz} />
          </section>
     </FeedLayout>
}
export const getServerSideProps = async(ctx) => {
     await connectDB();
     const session = await getSession(ctx)
     const {id} = ctx.query;
     const quiz = JSON.parse(JSON.stringify(await HartsQuiz.findOne({id})));
     const teacher = await User.findOne({email: quiz.teacherEmail})
     return quiz ? {props: {quiz,session,teacherId: teacher.userId}} : {notFound: true}
}