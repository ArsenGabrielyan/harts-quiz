"use client";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
     FormField,
     FormItem,
     FormLabel,
     FormControl,
     FormMessage
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
     Select,
     SelectTrigger,
     SelectValue,
     SelectItem,
     SelectContent} from "@/components/ui/select"
import { QUIZ_TYPES_LIST } from "@/lib/constants/others";
import { Button } from "../ui/button";
import { ArrowDown, ArrowUp, CheckCircle, CopyPlus, Minus, Plus, Trash } from "lucide-react";
import { getInitialAnswers } from "@/lib/helpers";
import { QuestionType } from "@prisma/client";
import { QuizEditorType } from "@/lib/types/schema";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface QuizEditorQuestionCardProps{
     index: number,
     isPending: boolean,
     totalQuestions: number,
     moveQuestion: (from: number, to: number) => void
     removeQuestion: (index: number) => void
     duplicateQuestion: (index: number) => void
}
export default function QuizEditorQuestionCard({
     index,
     isPending,
     totalQuestions,
     moveQuestion,
     removeQuestion,
     duplicateQuestion
}:QuizEditorQuestionCardProps){
     const {control,watch,setValue} = useFormContext<QuizEditorType>();
     const questionType = watch(`questions.${index}.type`);
     const correctAnswer = watch(`questions.${index}.correct`);
     const { fields: answerFields, append, remove, replace } = useFieldArray({
          control,
          name: `questions.${index}.answers`
     });
     const handleQuestionTypeChange = (value: string) => {
          const questionType = value as QuestionType
          const {answers,correct} = getInitialAnswers(questionType);
          setValue(`questions.${index}.type`, questionType);
          replace(answers);
          setValue(`questions.${index}.correct`, {
               id: 0,
               text: correct
          });
     }
     const addAnswer = () => {
          append({ text: "" });
     }
     const removeAnswer = () => {
          if (answerFields.length <= 2) return;
          const newLength = answerFields.length - 1;
          remove(newLength);
          const currentCorrect = watch(`questions.${index}.correct`);

          if (currentCorrect?.id !== undefined && currentCorrect.id >= newLength) {
               setValue(`questions.${index}.correct`, {
                    id: newLength - 1,
                    text: watch(`questions.${index}.answers.${newLength - 1}.text`)
               });
          }
     };
     useEffect(() => {
          if (questionType === "text") setValue(`questions.${index}.correct.id`, 0);
     }, [questionType, index]);
     return (
          <div className="p-4 w-full max-w-inherit bg-background border shadow rounded-xl mt-4 space-y-4">
               <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                         <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              onClick={()=>moveQuestion(index,index-1)}
                              disabled={index===0}
                         >
                              <ArrowUp/>
                         </Button>
                         <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              onClick={()=>moveQuestion(index,index+1)}
                              disabled={index===totalQuestions-1}
                         >
                              <ArrowDown/>
                         </Button>
                    </div>
               </div>
               <FormField
                    control={control}
                    name={`questions.${index}.question`}
                    render={({field})=>(
                         <FormItem>
                              <FormLabel>Հարց #{index+1}</FormLabel>
                              <FormControl>
                                   <Input
                                        {...field}
                                        disabled={isPending}
                                        placeholder="Տեղադրեք հարցը այստեղ։"
                                   />
                              </FormControl>
                              <FormMessage/>
                         </FormItem>
                    )}
               />
               <FormField
                    control={control}
                    name={`questions.${index}.description`}
                    render={({field})=>(
                         <FormItem>
                              <FormLabel>Նկարագրություն</FormLabel>
                              <FormControl>
                                   <Textarea
                                        {...field}
                                        disabled={isPending}
                                        placeholder="Ավելացնել այդ հարցի հետ կապված նկարագրություն"
                                   />
                              </FormControl>
                         </FormItem>
                    )}
               />
               {questionType==="pick_one" && (
                    <>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                              {answerFields.map((answer,answerIndex)=>{
                                   const isCorrectChosen = correctAnswer.text===answer.text
                                   return (
                                        <FormField
                                             key={answer.id}
                                             control={control}
                                             name={`questions.${index}.answers.${answerIndex}.text`}
                                             render={({ field }) => (
                                                  <FormItem>
                                                       <FormLabel>Պատասխան {answerIndex + 1}</FormLabel>
                                                       <div className="flex items-center gap-2">
                                                            <Button
                                                                 type="button"
                                                                 variant={isCorrectChosen ? "success" : "outline"}
                                                                 size="icon"
                                                                 onClick={() => setValue(`questions.${index}.correct`, {
                                                                      id: answerIndex,
                                                                      text: watch(`questions.${index}.answers.${answerIndex}.text`)
                                                                 })}
                                                                 className={cn("opacity-30", isCorrectChosen && "opacity-100")}
                                                            >
                                                                 <CheckCircle />
                                                            </Button>
                                                            <FormControl>
                                                                 <Input
                                                                      {...field}
                                                                      disabled={isPending}
                                                                      placeholder="Նշել պատասխանն այստեղ"
                                                                 />
                                                            </FormControl>
                                                       </div>
                                                       <FormMessage />
                                                  </FormItem>
                                             )}
                                        />
                                   )
                              })}
                         </div>
                         <div className="flex justify-between items-center gap-2 w-full">
                              <Button type="button" size="icon" variant="outline" onClick={removeAnswer} disabled={answerFields.length<=2}><Minus/></Button>
                              <span>{answerFields.length}</span>
                              <Button type="button" size="icon" variant="outline" onClick={addAnswer} disabled={answerFields.length>=6}><Plus/></Button>
                         </div>
                    </>
               )}
               {questionType==="true_false" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                         <Button
                              type="button"
                              variant={correctAnswer?.text === "true" ? "default" : "outline"}
                              onClick={() =>
                                   setValue(`questions.${index}.correct`, {
                                        id: 0,
                                        text: "true"
                                   })
                              }
                         >Այո</Button>
                         <Button
                              type="button"
                              variant={correctAnswer?.text === "false" ? "default" : "outline"}
                              onClick={() =>
                                   setValue(`questions.${index}.correct`, {
                                        id: 1,
                                        text: "false"
                                   })
                              }
                         >Ոչ</Button>
                    </div>
               )}
               {questionType==="text" && (
                    <FormField
                         control={control}
                         name={`questions.${index}.correct.text`}
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>Ճիշտ պատասխան</FormLabel>
                                   <FormControl>
                                        <Input
                                             {...field}
                                             disabled={isPending}
                                             placeholder="Տեղադրել այս հարցի ճիշտ պատասխանը"
                                        />
                                   </FormControl>
                                   <FormMessage/>
                              </FormItem>
                         )}
                    />
               )}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <FormField
                         control={control}
                         name={`questions.${index}.type`}
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>Հարցի տեսակ</FormLabel>
                                   <Select
                                        onValueChange={(value) => {
                                             field.onChange(value);
                                             handleQuestionTypeChange(value);
                                        }}
                                        value={field.value}
                                   >
                                        <FormControl>
                                             <SelectTrigger>
                                                  <SelectValue placeholder="Ընտրել հարցի տեսակը"/>
                                             </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                             {QUIZ_TYPES_LIST.map(({type,Icon,name},i)=>(
                                                  <SelectItem key={i} value={type}>
                                                       <div className="flex item-center justify-center gap-x-3">
                                                            <Icon className="w-[20px] h-[20px]"/>
                                                            {name}
                                                       </div>
                                                  </SelectItem>
                                             ))}
                                        </SelectContent>
                                   </Select>
                              </FormItem>
                         )}
                    />
                    <FormField
                         control={control}
                         name={`questions.${index}.timer`}
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>Տևողություն (Վրկ․)</FormLabel>
                                   <FormControl>
                                        <Input
                                             {...field}
                                             type="number"
                                             max={180}
                                             min={0}
                                             disabled={isPending}
                                             onChange={e=>field.onChange(e.target.valueAsNumber)}
                                        />
                                   </FormControl>
                                   <FormMessage/>
                              </FormItem>
                         )}
                    />
                    <FormField
                         control={control}
                         name={`questions.${index}.points`}
                         render={({field})=>(
                              <FormItem>
                                   <FormLabel>Միավոր</FormLabel>
                                   <FormControl>
                                        <Input
                                             {...field}
                                             type="number"
                                             min={0}
                                             disabled={isPending}
                                             onChange={e=>field.onChange(e.target.valueAsNumber)}
                                        />
                                   </FormControl>
                                   <FormMessage/>
                              </FormItem>
                         )}
                    />
               </div>
               <div className="flex justify-center items-center gap-2 flex-wrap">
                    <Button type="button" onClick={()=>duplicateQuestion(index)}><CopyPlus/> Կրկնօրինակել</Button>
                    <Button type="button" variant="destructive" onClick={()=>removeQuestion(index)}><Trash/> Ջնջել</Button>
               </div>
          </div>
     )
}