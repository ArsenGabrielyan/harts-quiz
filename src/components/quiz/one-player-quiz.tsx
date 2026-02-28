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
import { ROUND_START_TIME} from "@/lib/constants/others"
import { IOnePlayerQuizState } from "@/lib/types";
import Timer from "./timer";
import QuizQuestion from "./quiz-question";
import { CircleCheck, CircleX } from "lucide-react";
import { formatCorrectAnswer, playSound, toPlaybackQuestion } from "@/lib/helpers";
import { SoundSwitchFormType } from "@/lib/types/schema";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

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
               phase: "countdown",
               startTimer: ROUND_START_TIME
          })
     }
     const handleTimeChange = (time: number) => {
          updateState({
               startTimer: time
          })
          if (time <= 0 && state.phase === "countdown") {
               updateState({phase: "question"})
          }
     }
     const handleAfterCheck = (answerId: number, correctAnswerId: number, points?: number, text?: string) => {
          const isCorrect = answerId===correctAnswerId;
          setState(prev => ({
               ...prev,
               correct: isCorrect ? prev.correct + 1 : prev.correct,
               wrong: !isCorrect ? prev.wrong + 1 : prev.wrong,
               points: isCorrect ? prev.points + (points ?? 0) : prev.points,
               phase: "result",
               correctText: !isCorrect ? text ?? "" : null
          }));
          if (soundEffectOn)
               playSound(isCorrect ? "correct.mp3" : "wrong.mp3");
     }
     const handleNextRound = () => {
          if (state.currIdx === questions.length - 1) {
               setState(prev => ({ ...prev, phase: "ended" }));
               if (soundEffectOn) playSound(correct > wrong ? "winner.mp3" : "tick.mp3");
               return;
          }
          setState(prev => ({
               ...prev,
               currIdx: prev.currIdx + 1,
               phase: "question"
          }));
     };
     const reset = () => {
          setState(INITIAL_1P_QUIZ_STATE);
          form.reset();
     }
     const {phase, currIdx, correct, wrong, points, startTimer, correctText} = state
     const currentQuestion = questions[currIdx]
     return (
          <QuizWrapper quizDetails={{name,teacher,subject,createdAt}}>
               {phase==="lobby" && (
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
               {phase==="countdown" && (
                    <Timer
                         time={startTimer}
                         initialTime={ROUND_START_TIME}
                         onTimeChange={handleTimeChange}
                    />
               )}
               {(phase==="question" && currentQuestion) && (
                    <QuizQuestion
                         key={currIdx}
                         question={toPlaybackQuestion(currentQuestion)}
                         mode="one-player"
                         soundEffectOn={soundEffectOn}
                         questionNumber={currIdx+1}
                         afterCheck={handleAfterCheck}
                    />
               )}
               {phase==="result" && (
                    <>
                    {correctText===null ? <FormSuccess message="Ճիշտ է"/> : <FormError message={`Սխալ է։ Ճիշտ պատասխան՝ ${formatCorrectAnswer(correctText)}`}/>}
                    <Button
                         type="button"
                         variant="outline"
                         onClick={handleNextRound}
                         className="w-full mt-4"
                    >
                         Անցնել հաջորդ հարցին
                    </Button>
                    </>
                    
               )}
               {phase==="ended" && (
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
               )}
          </QuizWrapper>
     )
}