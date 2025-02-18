"use client"
import { useState } from "react";
import PageLayout from "../page-layout";
import QuizCard from "@/components/cards/quiz-card";
import { QuizDocument } from "@/data/types";
import { Button } from "@/components/ui/button";
import { subjectList } from "@/data/constants";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

interface QuizListProps{
     quizzes: QuizDocument[] | null;
}
export default function QuizList({quizzes}:QuizListProps){
     const [search, setSearch] = useState("");
     const [visibleItems, setVisibleItems] = useState(12);
     const [selectedSubject, setSelectedSubject] = useState("");
     const handleLoadMore = () => {
          setVisibleItems(prev=>prev+12);
     }
     return (
          <PageLayout mainClassName="flex flex-col items-center justify-start gap-y-3" searchBox={{search,setSearch}}>
               <h1 className="text-3xl md:text-4xl text-center">Ուսումնասիրել</h1>
               <div className="bg-background shadow rounded-xl p-5 px-16 flex justify-start items-center gap-3 flex-wrap w-full max-w-8xl">
                    <Carousel className="w-full">
                         <CarouselContent>
                              <CarouselItem className="basis-1/8">
                                   <Button variant={selectedSubject==="" ? "default" : "outline"} onClick={()=>setSelectedSubject("")}>Ցույց տալ բոլորը</Button>
                              </CarouselItem>
                              {subjectList.map((subject,i)=>(
                                   <CarouselItem className="basis-1/8" key={i}>
                                        <Button variant={subject.name===selectedSubject ? "default" : "outline"} onClick={()=>setSelectedSubject(subject.name)}>{subject.title}</Button>
                                   </CarouselItem>
                              ))}
                         </CarouselContent>
                         <CarouselPrevious/>
                         <CarouselNext/>
                    </Carousel>
               </div>
               <div className="flex flex-wrap justify-center items-center gap-4">
                    {quizzes && quizzes
                    .filter(val=>val.name.toLowerCase().includes(search.toLowerCase()))
                    .filter(val=>{
                         if(selectedSubject==="") return true;
                         return val.subject===selectedSubject
                    })
                    .slice(0,visibleItems)
                    .map(quiz=><QuizCard quiz={quiz} key={quiz.id}/>)}
               </div>
               {quizzes && visibleItems < quizzes.length && (
                    <Button variant="outline" onClick={handleLoadMore}>Ցույց տալ ավելին</Button>
               )}
          </PageLayout>
     )
}