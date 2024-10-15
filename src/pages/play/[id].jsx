import Timer from "@/components/questions/timer";
import Image from "next/image";
import { useState } from "react";
import QuestionSolo from "@/components/questions/questionSolo";
import Button from "@/components/formComponents/button";
import connectDB from "@/lib/tools/connectDb";
import HartsQuiz from "@/model/Quiz";
import Link from "next/link";
import { getSession } from "next-auth/react";
import User from "@/model/User";
import ToggleSwitch from "@/components/formComponents/toggle-switch";
import FeedLayout from "@/components/feed/FeedLayout";

export default function PlaySolo({quiz, session}){
     const [started, setStarted] = useState(false);
     const [progress, setProgress] = useState(5);
     const [currIdx, setCurrIdx] = useState(0);
     const [nextRoundReady, setNextRoundReady] = useState(false);
     const [correct, setCorrect] = useState(0);
     const [soundEffectOn, setSoundEffectOn] = useState(session?.soundEffectOn);
     const afterCheck = (answer,correct) => {
          const isCorrect = answer.toLowerCase() === correct.toLowerCase()
          if(isCorrect) setCorrect(prev=>prev+1);
          if(soundEffectOn){
               const audio = new Audio(`/sounds/${isCorrect? 'correct' : 'wrong'}.mp3`);
               audio.play();
          }
          setNextRoundReady(true);
     }
     const handleNextRound = () => {
          if(currIdx!==quiz.questions.length-1){
               setCurrIdx(prev=>prev+1);
               setNextRoundReady(false);
          } else {
               setCurrIdx(prev=>prev+1);
               setNextRoundReady(true)
               if(soundEffectOn){
                    const audio = new Audio("/sounds/winner.mp3");
                    audio.play();
               }
          }
     }
     const reset = () => {
          setStarted(false);
          setProgress(5);
          setCurrIdx(0);
          setNextRoundReady(false);
          setCorrect(0)
     }
     return <FeedLayout type="main">
          {!started ? <>
          <Link href="/feed"><Image src="/logos/logo-white.svg" alt="harts" width={250} height={150} priority/></Link>
          <h2>{quiz.name}</h2>
          <p>{quiz.teacher}</p>
          <form className="form-container my">
               <div className="inner-width">
                    <ToggleSwitch title="Ձայնային Էֆֆեկտներ" name="soundEffectOn" onChange={e=>setSoundEffectOn(e.target.checked)} checked={soundEffectOn}/>
               </div>
          </form>
          <Button btnStyle="outline-white" onClick={()=>setStarted(true)}>Սկսել</Button>
     </> : progress<=0 ? <>
          {currIdx<=quiz.questions.length && quiz.questions.map((val,i)=>{
               if(i===currIdx) return <QuestionSolo data={val} key={i} afterCheck={afterCheck} soundEffectOn={soundEffectOn} questionNumber={i+1}/>
          })}
          {nextRoundReady && <>
               {currIdx!==quiz.questions.length ? <Button btnStyle="outline-white mt" onClick={handleNextRound}>Անցնել հաջորդին</Button> : <div className="results-solo">
                    <h2>Դուք վաստակել եք {correct}-ը {quiz.questions.length}-ից</h2>
                    <Button btnStyle="outline-white mt" onClick={reset}>Վերջացնել</Button>
               </div>}
          </> }
     </> : <Timer time={progress} setTime={setProgress} initialTime={5} />}
     </FeedLayout>
}
export const getServerSideProps = async(ctx) => {
     await connectDB()
     const {id} = ctx.query, session = await getSession(ctx);
     const quiz = JSON.parse(JSON.stringify(await HartsQuiz.findOne({id})));
     const user = await User.findOne({email: session?.user?.email})
     return quiz ? {props: {quiz, session: JSON.parse(JSON.stringify(user))}} : {notFound: true}
}