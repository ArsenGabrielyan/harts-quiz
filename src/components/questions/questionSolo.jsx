import Image from "next/image";
import { useEffect, useState } from "react";
import Timer from "./timer";
import { getAnswerFormat } from "@/lib/helpers";
import Button from "../formComponents/button";
import { MdCheck, MdClose } from "react-icons/md";

export default function QuestionSolo({data, afterCheck, soundEffectOn, questionNumber}){
     const mode = 'student'
     const answerFormat = getAnswerFormat(data.type);
     const [currTime, setCurrTime] = useState(data.timer);
     const [currAnswer, setCurrAnswer] = useState('');
     const [input, setInput] = useState('');
     const checkAnswer = (answ) => {
          setCurrAnswer(answ)
          setCurrTime(0);
     }
     const handleSubmit = e => {
          e.preventDefault();
          checkAnswer(input)
     }
     useEffect(()=>{
          if(currTime<=0) {
               if(afterCheck) afterCheck(currAnswer,data.correct);
          }
          //eslint-disable-next-line
     },[currTime])
     useEffect(()=>{
          if(soundEffectOn){
               const audio = new Audio("/sounds/start.mp3");
               audio.play();
          }
     },[soundEffectOn])
     const isCorrect = currAnswer.toLowerCase()===data.correct.toLowerCase();
     return <div className={`quiz ${data.type}`}>
     <Image src="/logos/logo.svg" alt="harts" width={100} height={50} priority className="logo"/>
     <h2 className="question">{currAnswer==="" ? <>{questionNumber}. {data.question}</> : isCorrect ? "Ճիշտ է" : `Սխալ է. Ճիշտ պատասխան՝ ${data.correct==="true" ? "Այո" : data.correct==="false" ? "Ոչ" : data.correct}`}</h2>
     {data.image && <div className="img"><Image src={data.image} fill alt="quiz-image"/></div>}
     {data.description && <p className="desc">{data.description}</p>}
     {mode==='student' ? <>
     {data.type==='text-answer' ? <form onSubmit={handleSubmit} className={currTime<=0 ? "disabled-quiz" : ""}>
          <input type="text" name="input" placeholder="Ձեր պատասխանը" value={input} onChange={e=>setInput(e.target.value)} className={currAnswer==="" ? "" : isCorrect ? "correct" : "wrong"}/>
          <Button type="submit" btnStyle="outline-blue">Հաստատել</Button>
     </form> : <div className={`answers ${currTime<=0 ? "disabled-quiz" : ""}`}>
          {data.answers.map((answ,i)=><Button btnStyle={`outline-blue ${currAnswer==="" ? "" : answ===data.correct ? "correct" : answ===currAnswer ? "wrong" : ''}`.trim()} key={i} onClick={()=>checkAnswer(answ)}>{data.type==='true-false' ? answerFormat[i] : `${answerFormat[i]}. ${answ}`}</Button>)}    
     </div>}
     </> : currTime<=0 ? <h2 className="correct">Ճիշտ պատասխան՝ {data.correct==="true" ? "Այո" : data.correct==="false" ? "Ոչ" : data.correct}</h2> : null}
     {currTime>0 && <Timer type="quiz" setTime={setCurrTime} time={currTime} initialTime={data.timer} />}
     </div>
}