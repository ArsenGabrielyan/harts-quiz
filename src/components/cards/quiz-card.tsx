import { QuizDocument } from "@/data/types/mongoose-document-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface QuizCardProps{
     quiz: QuizDocument
}
export default function QuizCard({quiz}:QuizCardProps){
     const {name,teacher,createdAt,questions} = quiz
     return (
          <Card className="w-full max-w-md">
               <CardHeader>
                    <CardTitle>{name}</CardTitle>
                    <CardDescription>{teacher}</CardDescription>
               </CardHeader>
               <CardContent>
                    <ul className="text-muted-foreground">
                         <li>{questions.length} Հարցեր</li>
                    </ul>
               </CardContent>
               <CardFooter className="flex-wrap gap-2">
                    <Button className="flex-1" asChild>
                         <Link href={`/play?id=${quiz._id}`}>Խաղալ</Link>
                    </Button>
                    <Button className="flex-1" asChild>
                         <Link href={`/host?id=${quiz._id}`}>Կազմակերպել</Link>
                    </Button>
                    <Button variant="outline" className="flex-1" asChild>
                         <Link href={`/explore/${quiz._id}`}>Իմանալ ավելին</Link>
                    </Button>
               </CardFooter>
          </Card>
     )
}