import AvatarEditor from "@/components/avatar-editor";
import PlayForm from "@/components/play-form";
import Question from "@/components/questions/question";
import Timer from "@/components/questions/timer";
import Image from "next/image";
import { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { generateId, getSocketUrl } from "@/lib/helpers";
import ReactNiceAvatar from "react-nice-avatar";
import User from "@/model/User";
import connectDB from "@/lib/tools/connectDb";
import axios from "axios";
import FeedLayout from "@/components/feed/FeedLayout";

export const PlayContext = createContext();
export default function MainPage({quizDetails,questionId}){
  const [formData, setFormData] = useState(quizDetails)
  const [currId, setCurrId] = useState('')
  const [submitted, setSubmitted] = useState(false);
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(5);
  const [currQuiz, setCurrQuiz] = useState(null);
  const [currIdx, setCurrIdx] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const [place, setPlace] = useState({});
  const [score, setScore] = useState(0);
  const socket = useRef(null);
  useEffect(()=>{
    socket.current = io(getSocketUrl());
    const currSocket = socket.current;
    currSocket.on('start quiz',(quiz,idx)=>{
      setCurrQuiz(quiz);
      setStarted(true);
      setCurrIdx(idx);
    })
    currSocket.on('start round',idx=>setCurrIdx(idx))
    currSocket.on('end quiz',async placement=>{
      setIsEnded(true);
      const mentioned = placement.find(val=>val.userId===formData.userId)
      setPlace(mentioned.place)
      await axios.patch("/")
    })
    currSocket.on('reset game',()=>{
      setStarted(false);
      setFormData({
        quizId: quizDetails.quizId,
        playerName: quizDetails.playerName,
        avatar: quizDetails.avatar
      })
      setCurrId('')
      setSubmitted(false);
      setProgress(5);
      setCurrQuiz(null);
      setCurrIdx(0);
      setIsEnded(false);
      setPlace(0)
    })
    return () => {
      socket.current.emit('leave',formData,currId);
      currSocket.off('start quiz');
      currSocket.off('start round');
      currSocket.off('end quiz');
      currSocket.disconnect()
    }
    // eslint-disable-next-line
  },[])
  const handleSubmit = (data,id)=>{
    socket.current.emit('join',data,id)
    setCurrId(id)
    setFormData(data)
  }
  const handleLeave = () =>{
    socket.current.emit('leave',formData,currId);
    setSubmitted(false);
  }
  const afterCheck = (answer,point,correct) => {
    const isCorrect = answer.toLowerCase() === correct.toLowerCase()
    setScore(prev=>isCorrect ? prev+point : prev);
    socket.current?.emit('round end',answer,point,correct,currId,formData.quizId)
    if(formData.soundEffectOn){
      const audio = new Audio(`/sounds/${isCorrect ? 'correct' : 'wrong'}.mp3`);
      audio.play();
    }
  }
  return <FeedLayout type="main">
    {started && <div className="player-status">
      <ReactNiceAvatar {...formData.avatar} className="avatar" />
      <div className="status-info">
        <h2>{formData.playerName}</h2>
        <p>{score} Միավոր</p>
      </div>
    </div>}
    {isEnded ? <div className="quiz-player-placement">
      <ReactNiceAvatar {...formData.avatar} className="placement-avatar"/>
      <h2>{formData.playerName}</h2>
      <p>Դուք Գրավել եք</p>
      <p className="place">{place} տեղ</p>
    </div> : !started ? <>
      <Image src="/logos/logo-white.svg" alt="harts" width={250} height={150} priority/>
      <PlayContext.Provider value={{setSubmitted,formData,setFormData,currId,socket}}>
      {!submitted ? <PlayForm onSubmit={handleSubmit} hasId={!!questionId}/> : <>
        <h2>Խնդրում ենք սպասել</h2>
        <p>Դուք կարող եք փոխել տեսքը</p>
        <AvatarEditor currAvatar={formData.avatar} handleLeave={handleLeave}/>
      </>}
    </PlayContext.Provider>
    <p className="info">Հարց ուսումնասիրելու համար սեղմել <Link href="/feed">Այստեղ</Link></p>
    </> : progress<=0 ? currQuiz.questions.map((val,i)=>{
      if(i===currIdx) return <Question data={val} key={i} afterCheck={afterCheck} soundEffectOn={formData.soundEffectOn} questionNumber={i+1}/>
    }) : <Timer time={progress} setTime={setProgress} initialTime={5} />}
  </FeedLayout>
}
export const getServerSideProps = async(ctx) => {
  await connectDB()
  const {id} = ctx.query;
  const session = await getSession(ctx);
  const user = await User.findOne({email: session?.user?.email, accountType: 'student'})
  const quizDetails = {
    quizId: id || "",
    playerName: session?.user?.accountType==='student' ? user?.name : '' || "",
    avatar: typeof user?.image === 'object' ? user?.image : null,
    userId: user ? user?.userId : generateId(12),
    soundEffectOn: user ? user.soundEffectOn : true
  }
  return { props: { quizDetails, questionId: id || "", session } }
}