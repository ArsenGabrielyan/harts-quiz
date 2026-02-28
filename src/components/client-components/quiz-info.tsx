"use client"
import { QuizDocument } from "@/lib/types";
import PageLayout from "../page-layout";
import { Button } from "../ui/button";
import { CopyPlus, Edit, Heart, Printer, Share, Trash, Loader, Link2, Lock } from "lucide-react";
import QuestionCard from "../cards/question-card";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";
import { fetcher, shareQuiz } from "@/lib/helpers";
import { duplicateQuiz } from "@/actions/quiz/duplicate-quiz";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useSWR from "swr"
import { LikeQuizResponse } from "@/app/api/like-quiz/route";
import { likeQuiz } from "@/actions/quiz/like-quiz";
import { deleteQuiz } from "@/actions/quiz"
import ReactMarkdown from "react-markdown";
import PrintQuiz from "../quiz/print-quiz";

interface QuizInfoProps{
     quiz: QuizDocument
}
export default function QuizInfo({quiz}: QuizInfoProps){
     const user = useCurrentUser();
     const router = useRouter();
     const isCurrUser = user?.email===quiz?.teacherEmail
     const isTeacher = user?.accountType==="teacher";
     const isStudent = user?.accountType==="student";
     const isPersonal = user?.accountType==="personal";
     const {data, isLoading, isValidating, mutate: update} = useSWR<LikeQuizResponse>(`/api/like-quiz?quizId=${quiz?.id}`,fetcher)
     const handleDuplicateQuiz = () => {
          duplicateQuiz(quiz?.id || "")
          .then(data=>{
               if(data.error) toast.error(data.error)
               if(data.success) toast.success(data.success)
          })
          .catch(()=>toast.error("Վայ, մի բան սխալ տեղի ունեցավ"))
     }
     const handleDeleteQuiz = () => {
          if(confirm("Իսկապե՞ս ջնջել այս հարցաշարը")){
               deleteQuiz(quiz?.id || "")
               .then(data=>{
                    if(data.error) toast.error(data.error)
                    if(data.success) router.push("/library");
               })
               .catch(()=>toast.error("Վայ, մի բան սխալ տեղի ունեցավ"))
          }
     }
     const handleLikeQuiz = () => {
          if(data?.error){
               toast.error(data.error)
               return;
          }
          likeQuiz(quiz?.id || "")
          .then(data=>{
               if(data.error) toast.error(data.error)
               if(data.success) update();
          })
          .catch(()=>toast.error("Վայ, մի բան սխալ տեղի ունեցավ"))
     }
     const handlePrintQuiz = () => {
          print();
     }
     return (
          <PageLayout>
               <div className="print:hidden">
                    {quiz && (
                         <>
                              <div className="bg-background shadow rounded-xl p-5 flex justify-between items-center flex-col md:flex-row gap-3">
                                   <div className="space-y-2 text-center md:text-left">
                                        <h1 className="text-2xl font-semibold flex items-center gap-4">{quiz.name} {
                                             quiz.visibility==="private" ? <Lock/> : 
                                             quiz.visibility==="unlisted" ? <Link2/> : ""
                                        }</h1>
                                        <p className="text-muted-foreground">{quiz.teacher}</p>
                                        <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
                                             <Button variant="ghost" size="icon" title="Կիսվել" onClick={()=>shareQuiz()}>
                                                  <Share/>
                                             </Button>
                                             <Button variant="ghost" size="icon" title="Տպել" onClick={handlePrintQuiz}>
                                                  <Printer/>
                                             </Button>
                                             {user && (
                                                  <Button variant="ghost" size="icon" title={data?.isLiked ? "Չհավանել" : 'Հավանել'} onClick={handleLikeQuiz} disabled={isLoading || isValidating}>
                                                       {(isLoading || isValidating) ? <Loader className="animate-spin"/> : <Heart className={data?.isLiked ? "text-primary" : "text-foreground"}/>}
                                                  </Button>
                                             )}
                                             {isCurrUser && (
                                                  <>
                                                       <Button variant="ghost" size="icon" title="Խմբագրել" asChild>
                                                            <Link href={`/quiz-editor?id=${quiz.id}`}><Edit/></Link>
                                                       </Button>
                                                       <Button variant="ghost" size="icon" title="Կրկնօրինակել" onClick={handleDuplicateQuiz}>
                                                            <CopyPlus/>
                                                       </Button>
                                                       <Button variant="ghost" size="icon" className="hover:text-destructive" title="Ջնջել" onClick={handleDeleteQuiz}>
                                                            <Trash/>
                                                       </Button>
                                                  </>
                                             )}
                                        </div>
                                   </div>
                                   <div className="flex flex-wrap items-center justify-center gap-2">
                                        {(isStudent || isPersonal) && (
                                             <Button className="flex-1" asChild>
                                                  <Link href="/play">Խաղալ</Link>
                                             </Button>
                                        )}
                                        {(isTeacher || isPersonal) && (
                                             <Button className="flex-1" asChild>
                                                  <Link href={`/host?id=${quiz.id}`}>Կազմակերպել</Link>
                                             </Button>
                                        )}
                                        <Button variant="outline" className="flex-1" asChild>
                                             <Link href={`/play/${quiz.id}`}>Խաղալ մենակ</Link>
                                        </Button>
                                   </div>
                              </div>
                              {quiz.description && (
                                   <>
                                        <h2 className="text-3xl md:text-4xl text-center my-3">Նկարագրություն</h2>
                                        <div className="flex flex-col items-center justify-center">
                                             <ReactMarkdown className="w-full prose lg:prose-lg text-foreground bg-background shadow rounded-xl p-5">
                                                  {quiz.description}
                                             </ReactMarkdown>
                                        </div>
                                   </>    
                              )}
                              <h2 className="text-3xl md:text-4xl text-center my-3">Հարցեր</h2>
                              <div className="flex flex-col gap-y-3">
                                   {quiz.questions.map((question,i)=><QuestionCard key={i} question={question} id={i+1}/>)}
                              </div>
                         </>
                    )}
               </div>
               <PrintQuiz quiz={quiz}/>
          </PageLayout>
     )
}