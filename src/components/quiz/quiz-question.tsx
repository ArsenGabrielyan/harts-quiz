import { GET_INITIAL_QUESTION_STATE } from "@/lib/constants/states";
import { formatCorrectAnswer, getAnswerFormat, getButtonVariantDependingOnAnswer, playSound } from "@/lib/helpers";
import { IAnswer, IQuestion, IQuestionState } from "@/lib/types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextAnswerFormSchema } from "@/lib/schemas";
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
import { TextAnswerFormType } from "@/lib/types/schema";

interface QuizQuestionProps{
     question: IQuestion,
     mode: "multiplayer" | "one-player",
     soundEffectOn: boolean,
     questionNumber: number,
     afterCheck?: (answerId: number, correctAnswerId: number) => void
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
     const form = useForm<TextAnswerFormType>({
          resolver: zodResolver(TextAnswerFormSchema),
          defaultValues: {
               answer: ""
          }
     })
     const checkAnswer = (answerId: number) => {
          updateState(mode==="multiplayer" ? {
               currAnswerId: answerId,
          } : {
               currAnswerId: answerId,
               currTime: 0
          })
          if(mode==="multiplayer" && soundEffectOn)
               playSound("tick.mp3",error=>toast.error(error))
     }
     const updateState = (overrides: Partial<IQuestionState>) => {
          setState(prev=>({...prev,...overrides}))
     }
     const handleSubmitAnswer = (values: TextAnswerFormType)=>{
          const answerId = question.answers.find(val=>val.text.toLowerCase().includes(values.answer))?.id
          checkAnswer(answerId ?? -1);
          if(mode==="multiplayer" && soundEffectOn)
               playSound("tick.mp3",error=>toast.error(error))
     }
     const handleChangeTime = (time: number) => {
          updateState({currTime: time})
     }
     useEffect(() => {
          if (state.currTime !== 0) return;
          if (!state.currAnswerId) return;
          afterCheck?.(state.currAnswerId, question.correct?.id ?? -1);
     }, [state.currTime, state.currAnswerId]);
     useEffect(()=>{
          if(soundEffectOn)
               playSound("start.mp3",error=>toast.error(error))
     },[soundEffectOn])
     const {currAnswerId,currTime} = state
     const isCorrect = currAnswerId===question.correct?.id
     return (
          <>
               <div className={cn("space-y-4",(currAnswerId===null || currTime>=0) && "mb-4")}>
                    <h2 className="text-2xl font-semibold">{questionNumber}. {question.question}</h2>
                    {(mode==="multiplayer" && (currAnswerId!==null && currTime>0)) && (
                         <p className="text-muted-foreground flex items-center gap-2"><Loader className="animate-spin"/> Խնդրում ենք սպասել․․․</p>
                    )}
                    {(currAnswerId===null || currTime!==0) ? null : isCorrect ? <FormSuccess message="Ճիշտ է"/> : <FormError message={`Սխալ է։ Ճիշտ պատասխան՝ ${formatCorrectAnswer(question.correct?.text ?? "")}`}/>}
                    {question.description && (
                         <p className="text-muted-foreground">{question.description}</p>
                    )}
               </div>
               {isTeacher && currTime<=0 && (
                    <h2 className="text-2xl font-semibold text-center w-full">Ճիշտ պատասխան՝ {formatCorrectAnswer(question.correct?.text ?? "")}</h2>
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
                                                                 disabled={currAnswerId!==null}
                                                            />
                                                       </FormControl>
                                                       <FormMessage/>
                                                  </FormItem>
                                             )}
                                        />
                                   </div>
                                   <Button type="submit" className="w-full" disabled={currAnswerId!==null}>Հաստատել</Button>
                              </form>
                         </Form>
                    ) : (
                         <div className="flex flex-col items-center justify-center gap-y-3">
                              {question.answers.map((answer,i)=>(
                                   <Button
                                        variant={getButtonVariantDependingOnAnswer(answer.id,question.correct?.id ?? -1,mode,state)}
                                        type="button"
                                        key={answer.id}
                                        onClick={()=>checkAnswer(answer.id)}
                                        className={cn("w-full",question.type==="pick_one" && "justift-start")}
                                        disabled={currAnswerId!==null || currTime<=0}
                                   >
                                        {question.type==="true_false" ? answerFormat[i] : `${answerFormat[i]}. ${answer.text}`}
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