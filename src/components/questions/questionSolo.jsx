import Image from "next/image";
import { useEffect, useState } from "react";
import Timer from "./timer";
import { getAnswerFormat } from "@/lib/helpers";
import Button from "../formComponents/button";

export default function QuestionSolo({data, afterCheck, soundEffectOn}){
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
               if(afterCheck) {
                    afterCheck(currAnswer,data.correct);
               }
          }
          //eslint-disable-next-line
     },[currTime])
     useEffect(()=>{
          if(soundEffectOn){
               const audio = new Audio("/sounds/start.mp3");
               audio.play();
          }
     },[])
     return <div className={`quiz ${data.type}`}>
     <Image src="/logos/logo-white.svg" alt="harts" width={100} height={50} priority className="logo"/>
     {currAnswer==='' ? <>
     <h2 className="question">{data.question}</h2>
     {data.image && <div className="img"><Image src={data.image} fill alt="quiz-image"/></div>}
     {data.description && <p className="desc">{data.description}</p>}
     {mode==='student' ? <>
     {currTime<=0 ? <h2 className="correct">{data.type==='true-false' ? `Պատասխան՝ ${data.correct==='true' ? 'Ճիշտ է' : 'Սխալ է'}` : `Ճիշտ պատասխան՝ ${data.correct}`}</h2> : data.type==='text-answer' ? <form onSubmit={handleSubmit}>
          <input type="text" name="input" placeholder="Ձեր պատասխանը" value={input} onChange={e=>setInput(e.target.value)}/>
          <Button type="submit" btnStyle="outline-white">Հաստատել</Button>
     </form> : <div className="answers">
          {data.answers.map((answ,i)=><Button btnStyle="outline-white mt" key={i} onClick={()=>checkAnswer(answ)}>{data.type==='true-false' ? answerFormat[i] : `${answerFormat[i]}. ${answ}`}</Button>)}    
     </div>}
     </> : currTime<=0 ? <h2 className="correct">Ճիշտ պատասխան՝ {data.correct}</h2> : null}
     </> : <h2 className="correct">{currAnswer===data.correct ? 'Դուք ճիշտ պատասխանեցիք' : `Սխալ է։ Ճիշտ պատասխան՝ ${data.type==='true-false' ? data.correct==='true' ? 'Այո' : "Ոչ" : data.correct}`}</h2>}
     {currTime>0 && <Timer type="quiz" setTime={setCurrTime} time={currTime} initialTime={data.timer} />}
     </div>
}