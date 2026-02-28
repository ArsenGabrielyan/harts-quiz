"use client"
import { QuizDocument } from "@/lib/types";
import QuizWrapper from "../quiz-wrapper";
import { formatNumberSuffix, generateGameCode, playSound } from "@/lib/helpers";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SoundSwitchFormSchema } from "@/lib/schemas";
import {
     Form,
     FormControl,
     FormDescription,
     FormField,
     FormItem,
     FormLabel,
     FormMessage
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch";
import { ExtendedUser } from "@/next-auth";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { INITIAL_MULTI_HOST_STATE } from "@/lib/constants/states";
import { QUIZ_START_TIME } from "@/lib/constants/others";
import { IMultiplayerHostState, IQuizPlacement, IQuizUser } from "@/lib/types";
import {produce} from "immer"
import {socket} from "@/socket";
import Timer from "../timer";
import QuizQuestion from "../quiz-question";
import { toast } from "sonner";
import { SoundSwitchFormType } from "@/lib/types/schema";

interface MultiplayerQuizHostProps{
     quiz: QuizDocument,
     user?: ExtendedUser
}
export default function MultiplayerQuizHost({quiz, user}: MultiplayerQuizHostProps){
     const {name,teacher,subject,createdAt,questions} = quiz;
     const [state, setState] = useState(INITIAL_MULTI_HOST_STATE);
     const [gameCode, setGameCode] = useState(generateGameCode())
     const updateState = (overrides: Partial<IMultiplayerHostState>) => {
          setState(prev=>({...prev,...overrides}));
     }
     const form = useForm<SoundSwitchFormType>({
          resolver: zodResolver(SoundSwitchFormSchema),
          defaultValues: {
               soundEffectOn: user?.soundEffectOn || false
          }
     })
     const soundEffectOn = form.watch("soundEffectOn");
     const handleStartQuiz = () => {
          socket.emit("start game",quiz,state.currIdx,gameCode);
          updateState({isStarted: true})
     }
     useEffect(()=>{
          socket.connect();
          socket.emit("join room",gameCode);
          socket.on("end round",(players: IQuizUser[]) => {
               updateState({users: players});
               setTimeout(()=>updateState({showLeaderBoard: true}),5000)
          })
          socket.on("update players",(players: IQuizUser[]) => {
               updateState({users: players});
          })
          return () => {
               socket.off("end round");
               socket.off("update players");
          }
     },[gameCode])
     const nextQuestion = () => {
          const nextIndex = state.currIdx+1;
          socket.emit("next round",nextIndex,gameCode)
          updateState({
               currIdx: nextIndex,
               showLeaderBoard: false
          })
     }
     const finishGame = () => {
          const places = new Array(state.users.length).fill(null).map((_,i)=>i+1);
          const sorted = produce(state.users,draft=>draft.sort(({points: a},{points: b})=>b-a));
          const placementArr: IQuizPlacement[] = sorted.map((val,i)=>{
               const {points,name,userId} = val;
               return {points,name,userId,place: places[i]}
          })
          socket.emit("finish quiz",gameCode,placementArr);
          updateState({isEnded: true});
          setTimeout(()=>{
               updateState({
                    showPlacements: true,
                    placements: placementArr
               });
               if(soundEffectOn)
                    playSound("winner.mp3",error=>toast.error(error));
          },5000);
     }
     const resetGame = () => {
          socket.emit("reset quiz", gameCode);
          setState(INITIAL_MULTI_HOST_STATE);
          setGameCode(generateGameCode());
          form.reset();
     }
     const handleChangeTime = (time: number) => {
          updateState({startTimer: time})
     }
     const {users, isStarted, isEnded, showPlacements, placements, startTimer, showLeaderBoard, currIdx} = state
     const leaderBoard = users.slice(0,5).sort(({points: a},{points: b})=>b-a);
     return (
          <>
          <QuizWrapper quizDetails={{name,teacher,subject,createdAt}}>
               {isEnded ? (
                    <div className="flex items-center justify-center flex-col gap-2">
                         <h2 className="text-2xl font-semibold">{!showPlacements ? "Հաղթող է ճանաչվում․․․" : placements[0].name}</h2>
                         {showPlacements && (
                              <>
                                   <ul className="flex items-center justify-center flex-col gap-2 w-full">
                                        {placements.slice(0,4).map((placement,i)=>(
                                             <li key={i} className={`w-full flex justify-between items-center border shadow ${placement.place===1 ? "bg-[#ffdc73] text-black" : placement.place===2 ? "bg-slate-300 text-black" : placement.place===3 ? "bg-[#be9f80] text-black" : "bg-card text-card-foreground"} p-4 rounded-xl`}>
                                                  <div>
                                                       <h3 className="text-2xl">{placement.name}</h3>
                                                       <p>{placement.points} Միավոր</p>
                                                  </div>
                                                  <h2 className="text-3xl">{formatNumberSuffix(placement.place)} Տեղ</h2>
                                             </li>
                                        ))}
                                   </ul>
                                   <Button variant="outline" onClick={resetGame}>Վերսկսել</Button>
                              </>
                         )}
                    </div>
               ) : isStarted ? (
                    startTimer<=0 ? (
                         showLeaderBoard ? (
                              <div className="flex items-center justify-center flex-col gap-2">
                                   <h2 className="text-2xl font-semibold">Առաջատարներ</h2>
                                   {leaderBoard && (
                                        <ul className="flex items-center justify-center flex-col gap-2 w-full">
                                             {leaderBoard.map((user,i)=>(
                                                  <li key={i} className="w-full flex justify-between items-center border shadow bg-card text-card-foreground p-4 rounded-xl">
                                                       <span className="text-xl">{i+1}. {user.name}</span>
                                                       <span className="text-muted-foreground">{user.points} Միավոր</span>
                                                  </li>
                                             ))}
                                        </ul>
                                   )}
                                   <Button variant="outline" onClick={()=>currIdx!==questions.length-1 ? nextQuestion() : finishGame()}>{currIdx!==questions.length-1 ? 'Անցնել հաջորդին' : 'Վերջացնել'}</Button>
                              </div>
                         ) : questions.map((question,i)=>{
                              if(i===currIdx) return (
                                   <QuizQuestion
                                        key={i}
                                        question={question}
                                        questionNumber={i+1}
                                        mode="multiplayer"
                                        soundEffectOn={soundEffectOn}
                                        isTeacher
                                   />
                              )
                         })
                    ) : (
                         <Timer
                              time={startTimer}
                              initialTime={QUIZ_START_TIME}
                              onTimeChange={handleChangeTime}
                         />
                    )
               ) : (
                    <>
                    <h2 className="text-xl md:text-2xl font-semibold mb-2">Խաղի կոդ՝ {gameCode}</h2>
                    <Form {...form}>
                         <form className="space-y-6" onSubmit={form.handleSubmit(handleStartQuiz)}>
                              <div className="space-y-4">
                                   <FormField
                                        control={form.control}
                                        name="soundEffectOn"
                                        render={({field})=>(
                                             <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                  <div className="space-y-0.5">
                                                       <FormLabel>Ձայնային էֆֆեկտներ</FormLabel>
                                                       <FormDescription>Ձայններ, որոնք օգտագործվում են Հարց հավելվածում հարցաշար պատասխանելիս</FormDescription>
                                                       <FormMessage/>
                                                  </div>
                                                  <FormControl>
                                                       <Switch
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                       />
                                                  </FormControl>
                                             </FormItem>
                                        )}
                                   />
                              </div>
                              <Button type="submit" className="w-full">Սկսել</Button>
                         </form>
                    </Form>
                    </>
               )}
          </QuizWrapper>
          {(!isStarted && users.length!==0) && (
               <div className="mt-2">
                    <h2 className="text-2xl md:text-3xl">Խաղացողներ</h2>
                    <div className="flex items-center justify-center flex-wrap gap-3 mt-3">
                         {users.map(user=>(
                              <p className="p-3 border shadow bg-primary text-primary-foreground rounded-xl" key={user.userId}>{user.name}</p>
                         ))}
                    </div>
               </div>
          )}
          </>
     )
}