"use client"
import { accTypeInArmenian, divideQuestionsBySubject } from "@/data/helpers";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageLayout from "../page-layout";
import { ExtendedUser } from "@/next-auth";
import { QuizDocument } from "@/data/types/mongoose-document-types";
import QuestionCard from "../cards/question-card";
import QuizCard from "../cards/quiz-card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

interface MainPageProps {
     user: ExtendedUser | null,
     questions: QuizDocument[] | null
}
export default function MainPage({user, questions}: MainPageProps) {
     return (
          <PageLayout mainClassName={`flex-1 flex flex-col items-center ${!user ? "justify-center" : "jsutify-start"}`}>
               {!user ? (
                    <>
                         <h1 className="text-3xl md:text-4xl lg:text-5xl">Բարի Գալուստ Հարց</h1>
                         <p className="my-4">Հավելված, որով դուք կզարգացնեք ձեր միտքը</p>
                         <div className="flex gap-x-2">
                              <Button asChild>
                                   <Link href="/play">Խաղալ</Link>
                              </Button>
                              <Button variant="outline" asChild>
                                   <Link href="/explore">Ուսումնասիրել</Link>
                              </Button>
                         </div>
                    </>
               ) : (
                    <>
                         <div className="bg-background shadow rounded-xl p-5 flex justify-center items-center flex-col sm:flex-row gap-4">
                              <Avatar className="w-24 h-24">
                                   <AvatarImage src={user.image || ""} className="rounded-full" />
                                   <AvatarFallback className="bg-primary">
                                        <User className="w-14 h-14 text-primary-foreground" />
                                   </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col justify-center items-center text-center sm:items-start sm:text-left gap-1">
                                   <h1 className="text-3xl font-semibold">Բարև {user.name?.split(' ')[0]}!</h1>
                                   <p className="text-muted-foreground">@{user.username}</p>
                                   <p>{accTypeInArmenian(user?.accountType)}</p>
                                   <div className="flex justify-center items-center gap-2 flex-wrap">
                                        <Button variant="outline" className="flex-1" asChild>
                                             <Link href="/settings">Կարգավորումներ</Link>
                                        </Button>
                                        <Button variant="outline" className="flex-1" asChild>
                                             <Link href="/settings">Բոլոր հարցաշարերը</Link>
                                        </Button>
                                   </div>
                              </div>
                         </div>
                         {questions && divideQuestionsBySubject(questions).map(((section,i)=>(
                              <div key={i}>
                                   <h2 className="text-3xl md:text-4xl text-center my-3">{section.title}</h2>
                                   <div className="flex flex-wrap items-center justify-center gap-3">
                                        {section.data.slice(0,10).map(quiz=><QuizCard key={quiz._id} quiz={quiz}/>)}
                                   </div>
                              </div>
                         )))}
                         <p>Բոլոր հարցաշարերը ուսումնասիրելու համար սեղմել <Button variant="link" asChild className="p-0" size="lg">
                              <Link href="/explore">այստեղ</Link>     
                         </Button>։</p>
                    </>
               )}
          </PageLayout>
     );
}