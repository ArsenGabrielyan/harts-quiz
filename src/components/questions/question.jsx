import Image from "next/image";
import { useEffect, useState } from "react";
import Timer from "./timer";
import { getAnswerFormat } from "@/lib/helpers";
import Button from "../formComponents/button";
import { MdCheck, MdClose } from "react-icons/md";

export default function Question({data, mode='student', afterCheck, soundEffectOn, questionNumber}){
     const answerFormat = getAnswerFormat(data.type);
     const [currTime, setCurrTime] = useState(data.timer);
     const [currAnswer, setCurrAnswer] = useState('');
     const [input, setInput] = useState('');
     const pickAnswer = answer => {
          setCurrAnswer(answer)
          if(soundEffectOn){
               const audio = new Audio("/sounds/tick.mp3");
               audio.play();
          }
     }
     const handleSubmit = e => {
          e.preventDefault();
          pickAnswer(input);
          if(soundEffectOn){
               const audio = new Audio("/sounds/tick.mp3");
               audio.play();
          }
     }
     useEffect(()=>{
          if(soundEffectOn){
               const audio = new Audio("/sounds/start.mp3");
               audio.play();
          }
     },[soundEffectOn])
     useEffect(()=>{
          if(currTime<=0) {
               if(afterCheck) afterCheck(currAnswer,data.points,data.correct)
          }
          //eslint-disable-next-line
     },[currTime])
     const isCorrect = currAnswer.toLowerCase()===data.correct.toLowerCase();
     return <div className={`quiz ${data.type}`}>
     <Image src="/logos/logo.svg" alt="harts" width={100} height={50} priority className="logo"/>
     <h2 className="question">{currAnswer==="" ? <>{questionNumber}. {data.question}</> : currTime!==0 ? "Խնդրում ենք սպասել" : isCorrect ? <><MdCheck /> Ճիշտ է</> : <><MdClose /> Սխալ է. Ճիշտ պատասխան՝ {data.correct==="true" ? "Այո" : data.correct==="false" ? "Ոչ" : data.correct}</>}</h2>
     {data.image && <div className="img"><Image src={data.image} fill alt="quiz-image"/></div>}
     {data.description && <p className="desc">{data.description}</p>}
     {mode==='student' ? <>
     {data.type==='text-answer' ? <form onSubmit={handleSubmit} className={currAnswer!=="" ? "disabled-quiz" : ""}>
          <input type="text" name="input" placeholder="Ձեր պատասխանը" value={input} onChange={e=>setInput(e.target.value)} className={(currAnswer==="" || currTime!==0) ? "" : isCorrect ? "correct" : "wrong"}/>
          <Button type="submit" btnStyle="outline-blue">Հաստատել</Button>
     </form> : <div className={`answers ${currAnswer!=="" ? "disabled-quiz" : ""}`}>
          {data.answers.map((answ,i)=><Button btnStyle={`outline-blue ${(currAnswer==="" || currTime!==0) ? "" : answ===data.correct ? "correct" : answ===currAnswer ? "wrong" : ''}`.trim()} key={i} onClick={()=>pickAnswer(answ)}>{data.type==='true-false' ? answerFormat[i] : `${answerFormat[i]}. ${answ}`}</Button>)}    
     </div>}
     </> : currTime<=0 ? <h2 className="answer">Ճիշտ պատասխան՝ {data.correct==="true" ? "Այո" : data.correct==="false" ? "Ոչ" : data.correct}</h2> : null}
     {currTime!==0 && <Timer type="quiz" setTime={setCurrTime} time={currTime} initialTime={data.timer} />}
     </div>
}