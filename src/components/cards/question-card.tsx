import { IQuestion } from "@/data/types/other-types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnswerType } from "@/data/helpers";

interface QuestionCardProps{
     question: IQuestion,
     id: number
}
export default function QuestionCard({question,id}:QuestionCardProps){
     return (
          <Card className="text-center sm:text-left">
               <CardHeader>
                    <CardTitle>{id} - {question.question}</CardTitle>
                    <CardDescription>{getAnswerType(question.type)}</CardDescription>
               </CardHeader>
               {(question.answers && question.type==="pick-one") && (
                    <CardContent>
                         <ul className="space-y-2">
                              {question.answers.map((answer,i)=>(
                                   <li key={i}>{i+1}. {answer}</li>
                              ))}
                         </ul>
                    </CardContent>
               )}
               <CardFooter className="gap-5 flex-col text-center sm:flex-row sm:text-left">
                    <p>{question.points} միավոր</p>
                    <p>{question.timer} վայրկյան</p>
               </CardFooter>
          </Card>
     )
}