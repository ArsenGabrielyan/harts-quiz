import { QuizDocument } from "@/data/types/mongoose-document-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";

interface QuizCardProps{
     quiz: QuizDocument
}
export default function QuizCard({quiz}:QuizCardProps){
     const {name,teacher,createdAt,questions,teacherEmail} = quiz
     const date = new Date(createdAt);
     const user = useCurrentUser();
     const isTeacher = user?.accountType==="teacher";
     const isStudent = user?.accountType==="student";
     const isPersonal = user?.accountType==="personal"
     return (
          <Card className="w-full max-w-md">
               <CardHeader>
                    <CardTitle>{name}</CardTitle>
                    <CardDescription>{teacher}&nbsp;&middot;&nbsp;{date.toLocaleDateString()}</CardDescription>
               </CardHeader>
               <CardContent>
                    <p className="text-muted-foreground">{questions.length} Հարցեր</p>
               </CardContent>
               <CardFooter className="flex-wrap gap-2">
                    {(isStudent || isPersonal || !user) &&(
                         <Button className="flex-1" asChild>
                              <Link href={`/play?id=${quiz._id}`}>Խաղալ</Link>
                         </Button>
                    )}
                    {(isTeacher || isPersonal) &&(
                         <Button className="flex-1" asChild>
                              <Link href={`/host?id=${quiz._id}`}>Կազմակերպել</Link>
                         </Button>
                    )}
                    <Button variant="outline" className="flex-1" asChild>
                         <Link href={`/explore/${quiz._id}`}>Իմանալ ավելին</Link>
                    </Button>
               </CardFooter>
          </Card>
     )
}