import ReactNiceAvatar from "react-nice-avatar"
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Image from "next/image";
import Link from "next/link";
import { produce } from "immer";
import Question from "@/components/questions/question";
import Timer from "@/components/questions/timer";
import HartsQuiz from "@/model/Quiz";
import { formatNumberSuffix, getSubjectInArmenian, getSocketUrl } from "@/lib/helpers";
import Button from "@/components/formComponents/button";
import connectDB from "@/lib/tools/connectDb";
import User from "@/model/User";
import { getSession } from "next-auth/react";
import ToggleSwitch from "@/components/formComponents/toggle-switch";
import useTheme from "next-theme";
import FeedLayout from "@/components/feed/FeedLayout";

export default function Quiz({currQuiz,soundEffectOn}){
     const socket = useRef(null);
     const [currIndex, setCurrIndex] = useState(0)
     const [users, setUsers] = useState([]);
     const [started, setStarted] = useState(false)
     const [progress, setProgress] = useState(5);
     const [showLeaderBoard, setShowLeaderBoard] = useState(false);
     const [isEnded, setIsEnded] = useState(false);
     const [placements, setPlacements] = useState([]);
     const [showPlacements, setShowPlacements] = useState(false);
     const [soundToggle, setSoundToggle] = useState(soundEffectOn);
     const {theme} = useTheme()
     const startGame = () => {
          socket.current?.emit('start game',currQuiz, currIndex);
          setStarted(true)
     }
     const nextQuestion = () => {
          setCurrIndex(prev=>{
               socket.current?.emit('next round',currQuiz,prev+1)
               return prev+1
          })
          setShowLeaderBoard(false);
     }
     const finishGame = () => {
          const places = new Array(users.length).fill(null).map((_,i)=>i+1);
          const sorted = produce(users,draft=>draft.sort(({points: a},{points: b})=>b-a));
          const placementArr = sorted.map((val,i)=>{
               const {points, name, userId, avatar} = val;
               return {points,name,userId,avatar, place: formatNumberSuffix(places[i])}
          })
          socket.current?.emit('finish quiz',currQuiz.id,placementArr)
          setIsEnded(true);
          setTimeout(()=>{
               setShowPlacements(true);
               setPlacements(placementArr);
               if(soundToggle){
                    const audio = new Audio("/sounds/winner.mp3");
                    audio.play();
               }
          },5000)
     }
     const resetGame = () => {
          socket.current?.emit('reset quiz',currQuiz.id)
          setCurrIndex(0);
          setUsers([]);
          setStarted(false);
          setProgress(5);
          setShowLeaderBoard(false);
          setIsEnded(false);
          setPlacements([]);
          setShowPlacements(false);
     }
     useEffect(()=>{
          socket.current = io(getSocketUrl());
          const currSocket = socket.current;
          currSocket.emit('join room', currQuiz.id)
          currSocket.on('end round',(answer,point,correct,id)=>{
               setUsers(prev=>{
                    const newArr = produce(prev,draft=>{
                         const mentioned = draft.find(val=>val.id===id);
                         if(answer===correct) mentioned.points+=point
                    })
                    return newArr
               })
               setTimeout(()=>setShowLeaderBoard(true),5000)
          })
          currSocket.on('change pfp',(avatar,id)=>setUsers(prev=>{
               const newArr = produce(prev,draft=>{
                    const mentioned = draft.find(val=>val.id===id);
                    mentioned.avatar = avatar
               })
               return newArr
          }))
          currSocket.on("update players",players=>setUsers(players.map(val=>{
               const {socketId, ...rest} = val;
               return rest;
          })))
          return () => {
               currSocket.off('end round')
               currSocket.off('change pfp');
               currSocket.off('update players');
               currSocket.disconnect()
          }
          //eslint-disable-next-line
     },[])
     const leaderboard = users.slice(0,5).sort(({points: a},{points: b})=>b-a);
     return <FeedLayout type="main">
          {isEnded ? <div className="quiz-results">
               {!showPlacements ? <h2>Հաղթող է ճանաչվում․․․</h2> : <>
                    <ReactNiceAvatar className="first-avatar" {...placements[0].avatar} />
                    <h2 className="name">{placements[0].name}</h2>
                    <h2 className="first-place">{placements[0].place} տեղ</h2>
                    <p>{placements[0].points} միավոր</p>
                    <div className="other-placements">
                         {placements.slice(0,4).map((val,i)=><div className={`player place${i+1}`} key={i}>
                              <ReactNiceAvatar className="player-avatar" {...val.avatar} />
                              <h2>{val.name}</h2>
                              <p className="place">{val.place} տեղ</p>
                              <p>{val.points} միավոր</p>
                         </div>)}
                    </div>
                    <Button btnStyle="outline-white mt" onClick={resetGame}>Ավարտել</Button>
               </>}
          </div> : started ? <>
               {progress<=0 ? <>
               {showLeaderBoard ? <div className="leaderboard">
                    <h2>Առաջատարներ</h2>
                    {leaderboard && leaderboard.map(val=><div className="player" key={val.id} id={val.id}>
                         {val.avatar && <ReactNiceAvatar className="player-avatar" {...val.avatar}/>}
                         <p>{val.name}</p>
                         <p>{val.points} միավոր</p>
                    </div>)}
                    <Button btnStyle="outline-white mt" onClick={()=>currIndex!==currQuiz.questions.length-1 ? nextQuestion() : finishGame()}>{currIndex!==currQuiz.questions.length-1 ? 'Անցնել հաջորդին' : 'Վերջացնել'}</Button>
               </div> : currQuiz.questions.map((val,i)=>{
                    if(i===currIndex) return <Question data={val} key={i} mode="teacher" socket={socket}/>
               })}
               </> : <Timer time={progress} setTime={setProgress} initialTime={5}/>}
          </> : <>
          <Image src="/logos/logo-white.svg" alt="harts" width={250} height={150} priority/>
          <p className="code">Խաղի կոդ՝ {currQuiz.id}</p>
          <p className="code">Թեմա՝ {currQuiz.name}</p>
          <p className="code">Առարկա՝ {getSubjectInArmenian(currQuiz.subject)}</p>
          {users.length<=0 ? <p>Խաղացողներ չկան</p> : <div className="hobby">
          <div className="players">
               {users && users.map(val=><div className="player" key={val.id} id={val.id}>
                    {val.avatar && <ReactNiceAvatar className="player-avatar" {...val.avatar}/>}
                    <p>{val.name}</p>
               </div>)}
          </div>
          </div>}
          <div className="form-container quizForm">
               <div className="inner-width">
                    <ToggleSwitch name="soundEffectOn" onChange={e=>setSoundToggle(e.target.checked)} title="Ձայնային Էֆֆեկտներ" checked={soundToggle}/>
                    <Button btnStyle="outline-blue" onClick={startGame}>Սկսել</Button>
               </div>
          </div>
          <p className="info">Հարց ուսումնասիրելու համար սեղմել <Link href="/feed">Այստեղ</Link></p>
          </>}
          {(started && progress<=0 && !showLeaderBoard) && <p>Հարցեր՝ {currIndex+1}/{currQuiz.questions.length}</p>}
     </FeedLayout>
}
export async function getServerSideProps(ctx){
     await connectDB();
     const session = await getSession(ctx);
     const {id} = ctx.query;
     const currQuiz = JSON.parse(JSON.stringify(await HartsQuiz.findOne({id})));
     const user = await User.findOne({email: session?.user?.email, $or: [{accountType: "teacher"},{accountType: "personal"}]});
     if(!session) return {redirect: {
          destination: '/auth/signin',
          permanent: false,
     }}
     if(session?.user?.accountType==='student') return {redirect: {
          destination: '/feed',
          permanent: false,
     }}
     return currQuiz ? {props: {currQuiz, soundEffectOn: user ? user?.soundEffectOn : true}} : {notFound: true}
}