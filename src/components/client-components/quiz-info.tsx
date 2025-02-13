"use client"
import { QuizDocument } from "@/data/types/mongoose-document-types";
import PageLayout from "../page-layout";
import { Button } from "../ui/button";
import { CopyPlus, Edit, Heart, Printer, Share, Trash } from "lucide-react";
import QuestionCard from "../cards/question-card";
import Link from "next/link";

interface QuizInfoProps{
     quiz: QuizDocument | null
}
export default function QuizInfo({quiz}: QuizInfoProps){
     return (
          <PageLayout>
               {quiz && (
                    <>
                         <div className="bg-background shadow rounded-xl p-5 flex justify-between items-center flex-col md:flex-row gap-3">
                              <div className="space-y-2 text-center md:text-left">
                                   <h1 className="text-2xl font-semibold">{quiz.name}</h1>
                                   <p className="text-muted-foreground">{quiz.teacher}</p>
                                   <div className="flex items-center gap-3 flex-wrap justify-center">
                                        <Button variant="ghost" size="icon">
                                             <Share/>
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                             <Printer/>
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                             <Heart/>
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                             <Edit/>
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                             <CopyPlus/>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="hover:text-destructive">
                                             <Trash/>
                                        </Button>
                                   </div>
                              </div>
                              <div className="flex flex-wrap items-center justify-center gap-2">
                                   <Button className="flex-1" asChild>
                                        <Link href={`/play?id=${quiz._id}`}>Խաղալ</Link>
                                   </Button>
                                   <Button variant="outline" className="flex-1" asChild>
                                        <Link href={`/host?id=${quiz._id}`}>Կազմակերպել</Link>
                                   </Button>
                                   <Button variant="outline" className="flex-1" asChild>
                                        <Link href={`/play/${quiz._id}`}>Խաղալ մենակ</Link>
                                   </Button>
                              </div>
                         </div>
                         <h1 className="text-3xl md:text-4xl text-center my-3">Հարցեր</h1>
                         <div className="flex flex-col gap-y-3">
                              {quiz.questions.map((question,i)=><QuestionCard key={i} question={question} id={i+1}/>)}
                         </div>
                    </>
               )}
          </PageLayout>
     )
}