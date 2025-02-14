"use client"
import { QuizDocument } from "@/data/types/mongoose-document-types";
import PageLayout from "../page-layout";
import { Button } from "../ui/button";
import { CopyPlus, Edit, Heart, Printer, Share, Trash } from "lucide-react";
import QuestionCard from "../cards/question-card";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";
import { shareQuiz } from "@/data/helpers";

interface QuizInfoProps{
     quiz: QuizDocument | null
}
export default function QuizInfo({quiz}: QuizInfoProps){
     const user = useCurrentUser();
     const isCurrUser = user?.email===quiz?.teacherEmail
     const isTeacher = user?.accountType==="teacher";
     const isStudent = user?.accountType==="student";
     const isPersonal = user?.accountType==="personal"
     return (
          <PageLayout>
               {quiz && (
                    <>
                         <div className="bg-background shadow rounded-xl p-5 flex justify-between items-center flex-col md:flex-row gap-3">
                              <div className="space-y-2 text-center md:text-left">
                                   <h1 className="text-2xl font-semibold">{quiz.name}</h1>
                                   <p className="text-muted-foreground">{quiz.teacher}</p>
                                   <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
                                        {/* TODO: Add More Options To Click On Buttons */}
                                        <Button variant="ghost" size="icon" title="Կիսվել" onClick={()=>shareQuiz()}>
                                             <Share/>
                                        </Button>
                                        <Button variant="ghost" size="icon" title="Տպել" onClick={()=>{}}>
                                             <Printer/>
                                        </Button>
                                        {user && (
                                             <Button variant="ghost" size="icon" title="Հավանել" onClick={()=>{}}>
                                                  <Heart/>
                                             </Button>
                                        )}
                                        {isCurrUser && (
                                             <>
                                                  <Button variant="ghost" size="icon" title="Խմբագրել" asChild>
                                                       <Link href={`/quiz-editor?id=${quiz._id}`}><Edit/></Link>
                                                  </Button>
                                                  <Button variant="ghost" size="icon" title="Կրկնօրինակել" onClick={()=>{}}>
                                                       <CopyPlus/>
                                                  </Button>
                                                  <Button variant="ghost" size="icon" className="hover:text-destructive" title="Ջնջել" onClick={()=>{}}>
                                                       <Trash/>
                                                  </Button>
                                             </>
                                        )}
                                   </div>
                              </div>
                              <div className="flex flex-wrap items-center justify-center gap-2">
                                   {(isStudent || isPersonal) && (
                                        <Button className="flex-1" asChild>
                                             <Link href={`/play?id=${quiz._id}`}>Խաղալ</Link>
                                        </Button>
                                   )}
                                   {(isTeacher || isPersonal) && (
                                        <Button className="flex-1" asChild>
                                             <Link href={`/host?id=${quiz._id}`}>Կազմակերպել</Link>
                                        </Button>
                                   )}
                                   <Button variant="outline" className="flex-1" asChild>
                                        <Link href={`/play/${quiz._id}`}>Խաղալ մենակ</Link>
                                   </Button>
                              </div>
                         </div>
                         <h2 className="text-3xl md:text-4xl text-center my-3">Հարցեր</h2>
                         <div className="flex flex-col gap-y-3">
                              {quiz.questions.map((question,i)=><QuestionCard key={i} question={question} id={i+1}/>)}
                         </div>
                    </>
               )}
          </PageLayout>
     )
}