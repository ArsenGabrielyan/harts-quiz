"use client"
import QuizWrapper from "../quiz-wrapper";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MultiplayerQuizFormSchema } from "@/schemas";
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
import { Input } from "@/components/ui/input";
import { ExtendedUser } from "@/next-auth";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { formatNumberSuffix, playSound } from "@/data/helpers";
import { GET_INITIAL_MULTI_PLAY_STATE, QUIZ_START_TIME } from "@/data/constants";
import { IMultiplayerPlayState, IQuizPlacement, IQuizUser } from "@/data/types";
import { v4 as uuidv4 } from "uuid";
import { QuizDocument } from "@/data/types";
import { GridLoader } from "react-spinners";
import {socket} from "@/socket";
import QuizQuestion from "../quiz-question";
import Timer from "../timer";

interface MultiplayerQuizPlayProps{
     user?: ExtendedUser,
     code: string
}
export default function MultiplayerQuizPlay({user,code}: MultiplayerQuizPlayProps){
     const [state, setState] = useState(GET_INITIAL_MULTI_PLAY_STATE(uuidv4()))
     const updateState = (overrides: Partial<IMultiplayerPlayState>) => {
          setState(prev=>({...prev,...overrides}));
     }
     const form = useForm<z.infer<typeof MultiplayerQuizFormSchema>>({
          resolver: zodResolver(MultiplayerQuizFormSchema),
          defaultValues: {
               quizCode: code || "",
               name: user?.name || "",
               soundEffectOn: user?.soundEffectOn || false,
          }
     })
     const soundEffectOn = form.watch("soundEffectOn");
     useEffect(()=>{
          socket.on("start quiz",(quiz: QuizDocument,idx: number)=>{
               updateState({
                    currIdx: idx,
                    currQuiz: quiz,
                    isStarted: true
               })
          })
          socket.on("update players",(room: IQuizUser[])=>{
               const player = room.find(val=>val.userId===state.formData.userId)
               if(player){
                    form.setValue("name",player.name)
               }
          })
          socket.on("start round",(idx: number) => {
               updateState({currIdx: idx})
          })
          socket.on("end quiz",(placement: IQuizPlacement[]) => {
               const mentioned = placement.find(val=>val.userId===state.formData.userId);
               console.log(mentioned, placement, state.formData.userId)
               updateState({
                    isEnded: true,
                    place: mentioned ? mentioned.place : 0
               })
          })
          socket.on("reset game",()=>{
               setState(GET_INITIAL_MULTI_PLAY_STATE(uuidv4()))
               form.reset();
          })
          return () => {
               socket.emit("leave",form.watch());
               socket.off("start quiz")
               socket.off("start round");
               socket.off("end quiz");
          }
          // eslint-disable-next-line
     },[state.formData.userId])
     const handleSubmitToHost = (values: z.infer<typeof MultiplayerQuizFormSchema>) => {
          const data: IQuizUser = {
               ...state.formData,
               name: values.name,
               quizId: values.quizCode,
               points: 0,
               socketId: socket.id || ""
          }
          updateState({isSubmitted: true,formData: {...data}})
          socket.emit("join",data);
     }
     const handleLeave = () => {
          socket.emit("leave",state.formData);
          updateState({isSubmitted: false})
     }
     const afterCheck = (answer: string, correctAnswer: string, points: number) => {
          const isCorrect = answer.toLowerCase()===correctAnswer.toLowerCase();
          socket.emit("round end",answer,points,correctAnswer,state.formData.userId,state.formData.quizId);
          setState(prev=>({...prev, score: isCorrect ? prev.score+points : prev.score}));
          if(soundEffectOn)
               playSound(isCorrect ? "correct.mp3" : "wrong.mp3");
     }
     const handleChangeTime = (time: number) => {
          updateState({startTimer: time})
     }
     const {isStarted, score, isEnded, isSubmitted, formData, place, startTimer, currQuiz, currIdx} = state
     return (
          <>
          {isStarted && (
               <div className="bg-background/90 fixed top-3 left-3 p-3 rounded-xl shadow">
                    <h2 className="text-xl">{formData.name}</h2>
                    <p className="text-muted-foreground">{score} Միավոր</p>
               </div>
          )}
          <QuizWrapper quizDetails={currQuiz ? {
               name: currQuiz.name,
               teacher: currQuiz.teacher,
               subject: currQuiz.subject,
               createdAt: currQuiz.createdAt
          } : undefined}>
               {isEnded ? (
                    <div className="flex items-center justify-center flex-col gap-2">
                         <h2 className="text-2xl">{formData.name}</h2>
                         <p>Դուք Գրավել եք</p>
                         <p className="text-2xl md:text-3xl text-primary">{formatNumberSuffix(place)} տեղ</p>
                    </div>
               ) : !isStarted ? (
                    !isSubmitted ? (
                         <Form {...form}>
                              <form onSubmit={form.handleSubmit(handleSubmitToHost)} className="space-y-6">
                                   <div className="space-y-4">
                                        <FormField
                                             control={form.control}
                                             name="quizCode"
                                             render={({field})=>(
                                                  <FormItem>
                                                       <FormLabel>Խաղի կոդ</FormLabel>
                                                       <FormControl>
                                                            <Input
                                                                 {...field}
                                                                 placeholder="12345678"
                                                            />
                                                       </FormControl>
                                                       <FormMessage/>
                                                  </FormItem>
                                             )}
                                        />
                                        <FormField
                                             control={form.control}
                                             name="name"
                                             render={({field})=>(
                                                  <FormItem>
                                                       <FormLabel>Աշակերտի անուն</FormLabel>
                                                       <FormControl>
                                                            <Input
                                                                 {...field}
                                                                 placeholder="Պողոս"
                                                            />
                                                       </FormControl>
                                                       <FormMessage/>
                                                  </FormItem>
                                             )}
                                        />
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
                                   <Button type="submit" className="w-full">Միանալ</Button>
                              </form>
                         </Form>
                    ) : (
                         <div className="flex items-center justify-center flex-col gap-2">
                              <GridLoader color="hsl(var(--primary))"/>
                              <p>Խնդրում ենք սպասել</p>
                              <Button type="button" className="w-full" onClick={handleLeave}>Հեռանալ խաղից</Button>
                         </div>
                    )
               ) : startTimer <= 0 ? (
                    currQuiz && currQuiz.questions.map((question,i)=>{
                         if(i===currIdx) return (
                              <QuizQuestion
                                   key={i}
                                   question={question}
                                   questionNumber={i+1}
                                   afterCheck={afterCheck}
                                   mode="multiplayer"
                                   soundEffectOn={soundEffectOn}
                              />
                         )
                    })
               ) : (
                    <Timer
                         time={startTimer}
                         initialTime={QUIZ_START_TIME}
                         onTimeChange={handleChangeTime}
                    />
               )}
          </QuizWrapper>
          </>
     )
}