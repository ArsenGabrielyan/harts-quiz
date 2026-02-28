"use client"
import { QuizDocument } from "@/lib/types";
import QuizWrapper from "./quiz-wrapper";
import { Button } from "../ui/button";
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
import { Switch } from "../ui/switch";
import { ExtendedUser } from "@/next-auth";
import { useState } from "react";
import { INITIAL_1P_QUIZ_STATE } from "@/lib/constants/states";
import { QUIZ_START_TIME} from "@/lib/constants/others"
import { IOnePlayerQuizState } from "@/lib/types";
import Timer from "./timer";
import QuizQuestion from "./quiz-question";
import { CircleCheck, CircleX } from "lucide-react";
import { playSound, toPlaybackQuestion } from "@/lib/helpers";
import { toast } from "sonner";
import { SoundSwitchFormType } from "@/lib/types/schema";

interface QuizFormProps{
     quiz: QuizDocument,
     user?: ExtendedUser
}
export default function OnePlayerQuiz({quiz,user}: QuizFormProps){
     const [state, setState] = useState(INITIAL_1P_QUIZ_STATE);
     const updateState = (overrides: Partial<IOnePlayerQuizState>) => {
          setState(prev=>({...prev,...overrides}))
     }
     const {name,teacher,subject,createdAt,questions} = quiz;
     const form = useForm<SoundSwitchFormType>({
          resolver: zodResolver(SoundSwitchFormSchema),
          defaultValues: {
               soundEffectOn: user?.soundEffectOn || false
          }
     })
     const soundEffectOn = form.watch("soundEffectOn");
     const handleStartQuiz = () => {
          updateState({
               isStarted: true
          })
     }
     const handleTimeChange = (time: number) => {
          updateState({
               startTimer: time
          })
     }
     const handleAfterCheck = (answer: string, correct: string, points: number) => {
          const isCorrect = answer.toLowerCase()===correct.toLowerCase();
          setState(prev=>({
               ...prev,
               correct: isCorrect ? prev.correct+1 : prev.correct,
               wrong: !isCorrect ? prev.wrong+1 : prev.wrong,
               points: isCorrect ? prev.points+points : prev.points,
               isNextRound: true
          }))
          if(soundEffectOn)
               playSound(isCorrect? 'correct.mp3' : 'wrong.mp3',error=>toast.error(error))
     }
     const handleNextRound = () => {
          setState(prev => ({
               ...prev,
               currIdx: prev.currIdx + 1,
               isNextRound: prev.currIdx !== questions.length - 1 ? false : true
          }))
          if (state.currIdx === questions.length - 1 && soundEffectOn)
               playSound("winner.mp3", error => toast.error(error));
     }
     const reset = () => {
          setState(INITIAL_1P_QUIZ_STATE);
          form.reset();
     }
     const {isStarted, startTimer,currIdx, isNextRound, correct, wrong, points} = state
     const currentQuestion = questions[currIdx]
     return (
          <QuizWrapper quizDetails={{name,teacher,subject,createdAt}}>
               {isStarted ? (
                    startTimer>0 ? (
                         <Timer
                              time={startTimer}
                              initialTime={QUIZ_START_TIME}
                              onTimeChange={handleTimeChange}
                         />
                    ) : (
                         <>
                              {currentQuestion && (
                                   <QuizQuestion
                                        key={currIdx}
                                        question={toPlaybackQuestion(currentQuestion)}
                                        mode="one-player"
                                        soundEffectOn={soundEffectOn}
                                        questionNumber={currIdx+1}
                                        afterCheck={handleAfterCheck}
                                   />
                              )}
                              {isNextRound && (
                                   currIdx!==questions.length ? (
                                        <Button
                                             type="button"
                                             variant="outline"
                                             onClick={handleNextRound}
                                             className="w-full mt-4"
                                        >
                                             Անցնել հաջորդ հարցին
                                        </Button>
                                   ) : (
                                        <div className="flex flex-col items-center justify-center gap-5">
                                             <h2 className="text-xl md:text-2xl font-semibold">Խաղը ավարտված է</h2>
                                             <p className="flex items-center gap-2"><CircleCheck className="text-emerald-500"/><span>Ճիշտ պատասխաններ՝ {correct}</span></p>
                                             <p className="flex items-center gap-2"><CircleX className="text-destructive"/><span>Սխալ պատասխաններ՝ {wrong}</span></p>
                                             <p className="text-center">Հավաքած միավորներ՝ {points}</p>
                                             <Button
                                                  type="button"
                                                  className="w-full"
                                                  onClick={reset}
                                             >
                                                  Վերսկսել
                                             </Button>
                                        </div>
                                   )
                              )}
                         </>
                    )
               ) : (
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
               )}
          </QuizWrapper>
     )
}