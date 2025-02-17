import { formatDate, getSubjectInArmenian } from "@/data/helpers";
import Logo from "../logo";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { SubjectName } from "@/data/types/other-types";
import { Button } from "../ui/button";
import Link from "next/link";

interface QuizWrapperProps{
     children: React.ReactNode,
     quizDetails?: {
          name: string,
          teacher: string,
          subject: SubjectName,
          createdAt: Date
     }
}
export default function QuizWrapper({children,quizDetails}: QuizWrapperProps){
     return (
          <Card className="w-full max-w-lg">
               <CardHeader>
                    <div className="w-full flex flex-col gap-y-4 items-center justify-center text-center md:text-left">
                         <Logo width={130} height={60}/>
                         {quizDetails && (
                              <>
                                   <h2 className="text-xl md:text-2xl font-semibold">{quizDetails.name}</h2>
                                   <p className="text-muted-foreground text-sm">{quizDetails.teacher}&nbsp;&middot;&nbsp;{getSubjectInArmenian(quizDetails.subject)}&nbsp;&middot;&nbsp;{formatDate(quizDetails.createdAt)}</p>
                              </>
                         )}
                    </div>
               </CardHeader>
               <CardContent>
                    {children}
               </CardContent>
               <CardFooter>
                    <p className="text-xs text-center w-full">Հարցաշարերը ուսումնասիրելու համար սեղմեք <Button asChild size="sm" variant="link" className="px-0">
                         <Link href="/explore">Այստեղ</Link>     
                    </Button></p>
               </CardFooter>
          </Card>
     )
}