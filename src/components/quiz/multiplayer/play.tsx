"use client"
import QuizWrapper from "../quiz-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MultiplayerQuizFormSchema } from "@/lib/schemas";
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
import { formatNumberSuffix, playSound, toPlaybackQuestion } from "@/lib/helpers";
import { GET_INITIAL_MULTI_PLAY_STATE } from "@/lib/constants/states";
import { QUIZ_START_TIME } from "@/lib/constants/others";
import { IMultiplayerPlayState, IQuizPlacement, IQuizUser } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { QuizDocument } from "@/lib/types";
import { GridLoader } from "react-spinners";
import {socket} from "@/socket";
import QuizQuestion from "../quiz-question";
import Timer from "../timer";
import { toast } from "sonner";
import { MultiplayerQuizFormType } from "@/lib/types/schema";

interface MultiplayerQuizPlayProps{
     user?: ExtendedUser,
     code: string
}
export default function MultiplayerQuizPlay({ user, code }: MultiplayerQuizPlayProps) {
     const [state, setState] = useState(GET_INITIAL_MULTI_PLAY_STATE(uuidv4()))
     const updateState = (overrides: Partial<IMultiplayerPlayState>) => setState(prev => ({ ...prev, ...overrides }));
     const form = useForm<MultiplayerQuizFormType>({
          resolver: zodResolver(MultiplayerQuizFormSchema),
          defaultValues: {
               quizCode: code || "",
               name: user?.name || "",
               soundEffectOn: user?.soundEffectOn || false,
          }
     })
     const soundEffectOn = form.watch("soundEffectOn");
     useEffect(() => {
          socket.on("start quiz", (quiz: QuizDocument, idx: number) => {
               updateState({
                    currIdx: idx,
                    currQuiz: quiz,
                    isStarted: true,
                    phase: "countdown",
                    startTimer: QUIZ_START_TIME
               });
          })
          socket.on("update players", (room: IQuizUser[]) => {
               const player = room.find(val => val.userId === state.formData.userId)
               if (player) form.setValue("name", player.name)
          })
          socket.on("start round", (idx: number) => {
               updateState({
                    currIdx: idx,
                    phase: "question"
               });
          })
          socket.on("phase change",({ phase, index }: {
               phase: typeof state["phase"],
               index: number
          })=>{
               updateState({
                    phase,
                    currIdx: index ?? state.currIdx,
                    startTimer: phase === "countdown" ? QUIZ_START_TIME : state.startTimer
               });
          })
          socket.on("end quiz", (placement: IQuizPlacement[]) => {
               const mentioned = placement.find(val => val.userId === state.formData.userId);
               updateState({
                    phase: "ended",
                    place: mentioned ? mentioned.place : 0
               })
          })
          socket.on("end round", (players: IQuizUser[]) => {
               const me = players.find(p => p.userId === state.formData.userId);
               if (!me) return;
               updateState({
                    formData: {
                         ...state.formData,
                         points: me.points
                    }
               });
          });
          socket.on("reset game", () => {
               setState(GET_INITIAL_MULTI_PLAY_STATE(uuidv4()))
               form.reset();
          })
          return () => {
               socket.emit("leave", state.formData);
               socket.off("start quiz");
               socket.off("update players");
               socket.off("start round");
               socket.off("end quiz");
               socket.off("reset game");
               socket.off("end round");
          }
          // eslint-disable-next-line
     }, [state.formData.userId])
     const handleSubmitToHost = (values: MultiplayerQuizFormType) => {
          const data: IQuizUser = {
               ...state.formData,
               name: values.name,
               quizId: values.quizCode,
               points: 0,
               socketId: socket.id || ""
          }
          updateState({ formData: data, phase: "waiting" });
          socket.emit("join", data);
     }
     const handleLeave = () => {
          socket.emit("leave", state.formData);
          updateState({ phase: "lobby" })
     }
     const afterCheck = (answer: string, correctAnswer: string) => {
          const isCorrect = answer.toLowerCase() === correctAnswer.toLowerCase();
          socket.emit("round end", answer, state.formData.quizId);
          if (soundEffectOn)
               playSound(isCorrect ? "correct.mp3" : "wrong.mp3", error => toast.error(error));
     }
     const handleChangeTime = (time: number) => {
          if (time <= 0 && state.phase === "countdown") {
               updateState({ phase: "question" });
          }
          updateState({ startTimer: time });
     };
     const { isStarted, phase, formData, place, startTimer, currQuiz, currIdx } = state
     const currentQuestion = currQuiz ? currQuiz.questions[currIdx] : null
     return (
          <>
               {isStarted && (
                    <div className="bg-background/90 fixed top-3 left-3 p-3 rounded-xl shadow">
                         <h2 className="text-xl">{formData.name}</h2>
                         <p className="text-muted-foreground">{formData.points} Միավոր</p>
                    </div>
               )}
               <QuizWrapper quizDetails={currQuiz ? {
                    name: currQuiz.name,
                    teacher: currQuiz.teacher,
                    subject: currQuiz.subject,
                    createdAt: currQuiz.createdAt
               } : undefined}>
                    {phase==="lobby" && (
                         <Form {...form}>
                              <form onSubmit={form.handleSubmit(handleSubmitToHost)} className="space-y-6">
                                   <div className="space-y-4">
                                        <FormField
                                             control={form.control}
                                             name="quizCode"
                                             render={({ field }) => (
                                                  <FormItem>
                                                       <FormLabel>Խաղի կոդ</FormLabel>
                                                       <FormControl>
                                                            <Input {...field} placeholder="12345678" />
                                                       </FormControl>
                                                       <FormMessage />
                                                  </FormItem>
                                             )}
                                        />
                                        <FormField
                                             control={form.control}
                                             name="name"
                                             render={({ field }) => (
                                                  <FormItem>
                                                       <FormLabel>Աշակերտի անուն</FormLabel>
                                                       <FormControl>
                                                            <Input {...field} placeholder="Պողոս" />
                                                       </FormControl>
                                                       <FormMessage />
                                                  </FormItem>
                                             )}
                                        />
                                        <FormField
                                             control={form.control}
                                             name="soundEffectOn"
                                             render={({ field }) => (
                                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                       <div className="space-y-0.5">
                                                            <FormLabel>Ձայնային էֆֆեկտներ</FormLabel>
                                                            <FormDescription>Ձայններ, որոնք օգտագործվում են Հարց հավելվածում հարցաշար պատասխանելիս</FormDescription>
                                                            <FormMessage />
                                                       </div>
                                                       <FormControl>
                                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                       </FormControl>
                                                  </FormItem>
                                             )}
                                        />
                                   </div>
                                   <Button type="submit" className="w-full">Միանալ</Button>
                              </form>
                         </Form>
                    )}
                    {phase==="waiting" && (
                         <div className="flex items-center justify-center flex-col gap-2">
                              <GridLoader color="hsl(var(--primary))" />
                              <p>Խնդրում ենք սպասել</p>
                              <Button type="button" className="w-full" onClick={handleLeave}>Հեռանալ խաղից</Button>
                         </div>
                    )}
                    {phase==="countdown" && (
                         <Timer
                              time={startTimer}
                              initialTime={QUIZ_START_TIME}
                              onTimeChange={handleChangeTime}
                         />
                    )}
                    {phase === "question" && currentQuestion && (
                         <QuizQuestion
                              key={currIdx}
                              question={toPlaybackQuestion(currentQuestion)}
                              questionNumber={currIdx + 1}
                              afterCheck={afterCheck}
                              mode="multiplayer"
                              soundEffectOn={soundEffectOn}
                         />
                    )}
                    {phase==="ended" && (
                         <div className="flex items-center justify-center flex-col gap-2">
                              <h2 className="text-2xl">{formData.name}</h2>
                              <p>Դուք Գրավել եք</p>
                              <p className="text-2xl md:text-3xl text-primary">{formatNumberSuffix(place)} տեղ</p>
                         </div>
                    )}
               </QuizWrapper>
          </>
     )
}