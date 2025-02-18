import { GET_INITIAL_QUESTION_STATE } from "@/data/constants";
import { formatCorrectAnswer, getAnswerFormat, getButtonVariantDependingOnAnswer, playSound } from "@/data/helpers";
import { IQuestion, IQuestionState } from "@/data/types";
import { useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextAnswerFormSchema } from "@/schemas";
import {
     Form,
     FormControl,
     FormField,
     FormItem,
     FormLabel,
     FormMessage
} from "@/components/ui/form"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormSuccess } from "../form-success";
import { FormError } from "../form-error";
import Timer from "./timer";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { toast } from "sonner";

interface QuizQuestionProps{
     question: IQuestion,
     mode: "multiplayer" | "one-player",
     soundEffectOn: boolean,
     questionNumber: number,
     afterCheck?: (answer: string, correctAnswer: string, points: number) => void
     isTeacher?: boolean;
}
export default function QuizQuestion({
     question,
     mode,
     soundEffectOn,
     questionNumber,
     afterCheck,
     isTeacher=false
}:QuizQuestionProps){
     const answerFormat = getAnswerFormat(question.type);
     const [state, setState] = useState(GET_INITIAL_QUESTION_STATE(question));
     const form = useForm<z.infer<typeof TextAnswerFormSchema>>({
          resolver: zodResolver(TextAnswerFormSchema),
          defaultValues: {
               answer: ""
          }
     })
     const checkAnswer = (answer: string) => {
          updateState(mode==="multiplayer" ? {
               currAnswer: answer,
          } : {
               currAnswer: answer,
               currTime: 0
          })
          if(mode==="multiplayer" && soundEffectOn)
               playSound("tick.mp3",error=>toast.error(error))
     }
     const updateState = (overrides: Partial<IQuestionState>) => {
          setState(prev=>({...prev,...overrides}))
     }
     const handleSubmitAnswer = (values: z.infer<typeof TextAnswerFormSchema>)=>{
          checkAnswer(values.answer);
          if(mode==="multiplayer" && soundEffectOn)
               playSound("tick.mp3",error=>toast.error(error))
     }
     const handleChangeTime = (time: number) => {
          updateState({currTime: time})
     }
     useEffect(()=>{
          if(state.currTime <= 0 && afterCheck)
               afterCheck(state.currAnswer,question.correct,question.points)
          // eslint-disable-next-line
     },[state.currTime])
     useEffect(()=>{
          if(soundEffectOn)
               playSound("start.mp3",error=>toast.error(error))
     },[soundEffectOn])
     const {currAnswer,currTime} = state
     const isCorrect = currAnswer.toLowerCase()===question.correct.toLowerCase();
     return (
          <>
               <div className={cn("space-y-4",(currAnswer==="" || currTime>=0) && "mb-4")}>
                    <h2 className="text-2xl font-semibold">{questionNumber}. {question.question}</h2>
                    {(mode==="multiplayer" && (currAnswer!=="" && currTime>0)) && (
                         <p className="text-muted-foreground flex items-center gap-2"><Loader/> Խնդրում ենք սպասել․․․</p>
                    )}
                    {(currAnswer==="" || currTime!==0) ? null : isCorrect ? <FormSuccess message="Ճիշտ է"/> : <FormError message={`Սխալ է։ Ճիշտ պատասխան՝ ${formatCorrectAnswer(question.correct)}`}/>}
                    {question.description && (
                         <p className="text-muted-foreground">{question.description}</p>
                    )}
               </div>
               {isTeacher && currTime<=0 && (
                    <h2 className="text-2xl font-semibold text-center w-full">Ճիշտ պատասխան՝ {formatCorrectAnswer(question.correct)}</h2>
               )}
               {!isTeacher && (
                    question.type==="text" ? (
                         <Form {...form}>
                              <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmitAnswer)}>
                                   <div className="space-y-4">
                                        <FormField
                                             control={form.control}
                                             name="answer"
                                             render={({field})=>(
                                                  <FormItem>
                                                       <FormLabel>Ձեր պատասխանը</FormLabel>
                                                       <FormControl>
                                                            <Input
                                                                 {...field}
                                                                 placeholder="Մուտքագրեք Ձեր պատասխանը այստեղ"
                                                                 disabled={currAnswer!==""}
                                                            />
                                                       </FormControl>
                                                       <FormMessage/>
                                                  </FormItem>
                                             )}
                                        />
                                   </div>
                                   <Button type="submit" className="w-full" disabled={currAnswer!==""}>Հաստատել</Button>
                              </form>
                         </Form>
                    ) : (
                         <div className="flex flex-col items-center justify-center gap-y-3">
                              {question.answers.map((answer,i)=>(
                                   <Button
                                        variant={getButtonVariantDependingOnAnswer(answer,question.correct,mode,state)}
                                        type="button"
                                        key={i}
                                        onClick={()=>checkAnswer(answer)}
                                        className={cn("w-full",question.type==="pick_one" && "justift-start")}
                                        disabled={currAnswer!=="" || currTime<=0}
                                   >
                                        {question.type==="true_false" ? answerFormat[i] : `${answerFormat[i]}. ${answer}`}
                                   </Button>
                              ))}
                         </div>
                    )
               )}
               {currTime>0 && (
                    <Timer time={currTime} initialTime={question.timer} onTimeChange={handleChangeTime} isInQuizQuestion/>
               )}
          </>
     )
}