"use client"
import { QuizEditorSchema } from "@/lib/schemas";
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent, SelectGroup, SelectLabel } from "@/components/ui/select"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { CheckSquare, Copy, TextCursorInput } from "lucide-react"
import { IoRadioButtonOn } from "react-icons/io5"
import PageLayout from "../page-layout"
import { useState, useTransition, useMemo } from "react";
import { Textarea } from "../ui/textarea";
import { absoluteUrl, getFilteredSubjects, getInitialAnswers, mapQuizToForm } from "@/lib/helpers";
import { VISIBILITIES_LIST } from "@/lib/constants/others";
import { $Enums, QuestionType } from "@prisma/client"
import QuizEditorQuestionCard from "./quiz-editor-question-form";
import { addQuiz, editQuiz } from "@/actions/quiz";
import { QuizDocument, SubjectName } from "@/lib/types";
import useUnsavedChangesWarning from "@/hooks/use-before-unload";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { QuizEditorType } from "@/lib/types/schema";

interface QuizEditorFormProps {
     currQuiz: QuizDocument | null;
}

export default function QuizEditorForm({ currQuiz }: QuizEditorFormProps) {
     const [quizId, setQuizId] = useState(currQuiz?.id || "");
     const [error, setError] = useState<string | undefined>("");
     const [success, setSuccess] = useState<string | undefined>("");
     const [isPending, startTransition] = useTransition();
     const router = useRouter()

     const initialData = useMemo<QuizEditorType>(() => currQuiz ? mapQuizToForm(currQuiz) : {
          name: "",
          description: undefined,
          visibility: "private",
          subject: SubjectName.Other,
          questions: []
     }, [currQuiz]);

     const form = useForm<QuizEditorType>({
          resolver: zodResolver(QuizEditorSchema),
          defaultValues: initialData,
     })

     const visibility = form.watch("visibility")
     const { fields, append, remove, move, insert } = useFieldArray<
          QuizEditorType,
          "questions"
     >({
          control: form.control,
          name: "questions",
     });

     const handleSubmit = (values: QuizEditorType) => {
          setError("");
          setSuccess("");
          startTransition(() => {
               const action = !currQuiz ? addQuiz(values) : editQuiz(values, currQuiz.id);
               action.then(data => {
                    if (data.success) {
                         setSuccess(data.success);
                         if (data.quizId) setQuizId(data.quizId);
                         form.reset(values);
                         if (currQuiz) setTimeout(() => router.push(`/explore/${currQuiz.id}`), 1000);
                    }
               })
               .catch(() => setError("Վայ, մի բան սխալ տեղի ունեցավ"))
          })
     }

     const handleReset = () => {
          form.reset(initialData);
          setError("");
          setSuccess("");
     }

     const addQuestion = (questionType: QuestionType) => {
          append({
               question: "",
               ...getInitialAnswers(questionType),
               timer: 30,   // sensible non-zero default (schema rejects 0)
               type: questionType,
               points: 1,   // sensible non-zero default (schema rejects 0)
               description: ""
          })
     }

     const duplicateQuestion = (index: number) => {
          const current = form.getValues(`questions.${index}`);
          const cloned = JSON.parse(JSON.stringify(current));
          insert(index + 1, cloned);
     };

     const copyUrl = () => {
          navigator.clipboard.writeText(absoluteUrl(`/explore/${quizId}`));
          toast.success("Հղումը պատճենված է");
     }

     useUnsavedChangesWarning(form.formState.isDirty);

     return (
          <PageLayout removeCreateButton>
               <div className="p-4 w-full bg-background border-b shadow flex items-center justify-start fixed top-[80px] left-0 gap-2 z-20">
                    <Button size="icon" variant="outline" title="Նշելով" onClick={() => addQuestion("pick_one")}>
                         <CheckSquare />
                    </Button>
                    <Button size="icon" variant="outline" title="Այո և Ոչ" onClick={() => addQuestion("true_false")}>
                         <IoRadioButtonOn />
                    </Button>
                    <Button size="icon" variant="outline" title="Գրավոր" onClick={() => addQuestion("text")}>
                         <TextCursorInput />
                    </Button>
               </div>
               <div className="mt-[70px] flex items-center justify-center w-full">
                    <Form {...form}>
                         <form onSubmit={form.handleSubmit(handleSubmit)} onReset={handleReset} className="w-full max-w-4xl">
                              <div className="p-4 w-full bg-background border shadow rounded-xl space-y-3">
                                   <FormSuccess message={success} />
                                   <FormError message={error} />
                                   <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
                                        {!currQuiz ? "Ստեղծել Հարցաշար" : "Խմբագրել Հարցաշարը"}
                                   </h1>
                                   <div className="space-y-4 mb-4">
                                        <FormField
                                             control={form.control}
                                             name="name"
                                             render={({ field }) => (
                                                  <FormItem>
                                                       <FormLabel>Հարցաշարի անուն</FormLabel>
                                                       <FormControl>
                                                            <Input {...field} disabled={isPending} placeholder="Թեմատիկ գրավոր աշխատանք" />
                                                       </FormControl>
                                                       <FormMessage />
                                                  </FormItem>
                                             )}
                                        />
                                        <FormField
                                             control={form.control}
                                             name="description"
                                             render={({ field }) => (
                                                  <FormItem>
                                                       <FormLabel>Նկարագրություն</FormLabel>
                                                       <FormControl>
                                                            <Textarea {...field} disabled={isPending} placeholder="Տեղադրել այս հարցաշարի մասին տեղեկություն այստեղ" />
                                                       </FormControl>
                                                       <FormMessage />
                                                  </FormItem>
                                             )}
                                        />
                                        <FormField
                                             control={form.control}
                                             name="visibility"
                                             render={({ field }) => (
                                                  <FormItem>
                                                       <FormLabel>Հասանելիություն</FormLabel>
                                                       <Select value={field.value} onValueChange={field.onChange}>
                                                            <FormControl>
                                                                 <SelectTrigger>
                                                                      <SelectValue placeholder="Ընտրել հասանելիությունը" />
                                                                 </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                 {VISIBILITIES_LIST.map(({ type, Icon, name }, i) => (
                                                                      <SelectItem key={i} value={type}>
                                                                           <div className="flex item-center justify-center gap-x-3">
                                                                                <Icon className="w-[20px] h-[20px]" />
                                                                                {name}
                                                                           </div>
                                                                      </SelectItem>
                                                                 ))}
                                                            </SelectContent>
                                                       </Select>
                                                       <FormMessage />
                                                  </FormItem>
                                             )}
                                        />
                                        <FormField
                                             control={form.control}
                                             name="subject"
                                             render={({ field }) => (
                                                  <FormItem>
                                                       <FormLabel>Առարկա</FormLabel>
                                                       <Select value={field.value} onValueChange={field.onChange}>
                                                            <FormControl>
                                                                 <SelectTrigger>
                                                                      <SelectValue placeholder="Ընտրել առարկան" />
                                                                 </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                 {getFilteredSubjects().map((optgroup, i) => (
                                                                      <SelectGroup key={i}>
                                                                           <SelectLabel>{optgroup.title}</SelectLabel>
                                                                           {optgroup.data.map((subject, i) => (
                                                                                <SelectItem key={i} value={subject.name}>{subject.title}</SelectItem>
                                                                           ))}
                                                                      </SelectGroup>
                                                                 ))}
                                                            </SelectContent>
                                                       </Select>
                                                       <FormMessage />
                                                  </FormItem>
                                             )}
                                        />
                                   </div>
                                   <div className="flex justify-start items-center flex-wrap gap-2">
                                        <Button className="flex-1" type="submit" disabled={isPending || !form.formState.isDirty}>
                                             {isPending ? "Խնդրում ենք սպասել․․․" : !!currQuiz ? "Խմբագրել" : visibility === "public" ? "Հրատարակել" : "Պահպանել"}
                                        </Button>
                                        <Button className="flex-1" type="reset" variant="outline" disabled={isPending || !form.formState.isDirty}>Չեղարկել</Button>
                                        {quizId && (
                                             <Button type="button" variant="outline" onClick={copyUrl}><Copy /> Պատճենել</Button>
                                        )}
                                   </div>
                              </div>
                              {fields.map((questionField, i) => (
                                   <QuizEditorQuestionCard
                                        key={questionField.id}
                                        index={i}
                                        isPending={isPending}
                                        totalQuestions={fields.length}
                                        moveQuestion={move}
                                        removeQuestion={remove}
                                        duplicateQuestion={duplicateQuestion}
                                   />
                              ))}
                         </form>
                    </Form>
               </div>
          </PageLayout>
     )
}