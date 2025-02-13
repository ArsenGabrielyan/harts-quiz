"use client"
import { User } from "lucide-react";
import PageLayout from "../page-layout";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { QuizDocument, UserDocument } from "@/data/types/mongoose-document-types";
import {absoluteUrl, accTypeInArmenian, getSubjectInArmenian} from "@/data/helpers"
import { Button } from "../ui/button";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown"
import QuizCard from "@/components/cards/quiz-card";

interface UserInfoProps{
     user: UserDocument | null,
     questions: QuizDocument[] | null
}
export default function UserInfo({user, questions}: UserInfoProps){
     const handleShareClick = async () => {
          if(user){
               const shareData = {
                    title: 'Հարց',
                    text: `${user.name} Հարց հավելվածում`,
                    url: location.href
               }
               if(navigator.canShare(shareData)) await navigator.share(shareData)
               else {
                    navigator.clipboard.writeText(location.href);
                    toast.success("Հղումը պատճենված է")
               }
          }
     }
     return (
          <PageLayout>
               {user && (
                    <>
                    <div className="bg-background shadow rounded-xl p-5 flex justify-between items-center flex-col sm:flex-row gap-4">
                         <div className="flex items-center gap-5 flex-col sm:flex-row">
                              <Avatar className="w-24 h-24">
                                   <AvatarImage src={user.image}/>
                                   <AvatarFallback className="bg-primary">
                                        <User className="w-14 h-14 text-primary-foreground"/>
                                   </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col justify-center items-center text-center sm:items-start sm:text-left">
                                   <h1 className="text-3xl font-semibold">{user.name}</h1>
                                   <p className="text-muted-foreground">@{user.username}</p>
                                   <p>{accTypeInArmenian(user?.accountType)}</p>
                                   {user.showFavoriteSubject && <p>Սիրած առարկա՝ {getSubjectInArmenian(user.favoriteSubject)}</p>}
                              </div>
                         </div>
                         <div>
                              <Button onClick={handleShareClick}>Կիսվել</Button>
                         </div>
                    </div>
                    {user.bio && (
                         <>
                              <h1 className="text-3xl md:text-4xl text-center my-3">Նկարագրություն</h1>
                              <div className="flex flex-col items-center justify-center">
                                   <ReactMarkdown className="w-full prose lg:prose-lg text-foreground bg-background shadow rounded-xl p-5">
                                        {user.bio}
                                   </ReactMarkdown>
                              </div>
                         </>
                    )}
                    {questions && (
                         <>
                              <h1 className="text-3xl md:text-4xl text-center my-3">Հարցաշարեր</h1>
                              <div className="flex flex-wrap justify-center items-center gap-4">
                                   {questions.map(question=><QuizCard key={question._id} quiz={question}/>)}
                              </div>
                         </>
                    )}
                    </>
               )}
          </PageLayout>
     )
}