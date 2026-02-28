import { IQuizDocumentQuestion } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnswerType } from "@/lib/helpers";

interface QuestionCardProps{
     question: IQuizDocumentQuestion,
     id: number
}
export default function QuestionCard({question,id}:QuestionCardProps){
     return (
          <Card className="text-center sm:text-left">
               <CardHeader>
                    <CardTitle>{id} - {question.question}</CardTitle>
                    <CardDescription>{getAnswerType(question.type)}</CardDescription>
               </CardHeader>
               {(question.description || (question.answers && question.type==="pick_one")) && (
                    <CardContent>
                         {question.description && <p className={question.answers && question.type==="pick_one" ? "mb-3" : ""}>{question.description}</p>}
                         <ul className="space-y-2">
                              {question.answers.map(answer=>(
                                   <li key={answer.id}>{answer.id}. {answer.text}</li>
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