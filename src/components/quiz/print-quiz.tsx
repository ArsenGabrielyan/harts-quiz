import { formatCorrectAnswer, formatDate, getSubjectInArmenian } from "@/lib/helpers";
import { QuizDocument } from "@/lib/types";
import Image from "next/image";

interface PrintQuizProps{
     quiz: QuizDocument
}
export default function PrintQuiz({quiz}:PrintQuizProps){
     const {subject,name,questions,createdAt} = quiz
     return (
          <div className="screen:hidden print:flex justify-center items-center flex-col gap-3 p-2 bg-white text-black">
               <Image src="/logos/logo.svg" alt="print-logo" width={150} height={50} />
               <div className="grid grid-cols-2 w-full">
                    <div className="w-fit">
                         <p>Առարկա՝ {getSubjectInArmenian(subject)}</p>
                         <p>Թեմա՝ {name}</p>
                         <p>Հարցերի քանակ՝ {questions.length}</p>
                         <p>Ստեղծման ամսաթիվ՝ {formatDate(createdAt)}</p>
                    </div>
                    <table className="w-full">
                         <tbody className="flex flex-col gap-1 w-full">
                              <tr className="grid" style={{gridTemplateColumns: "1fr 2fr"}}>
                                   <td>Անուն Ազգանուն</td>
                                   <td className="border-black border-b h-6 w-full"/>
                              </tr>
                              <tr className="grid" style={{gridTemplateColumns: "1fr 2fr"}}>
                                   <td>Դասարան</td>
                                   <td className="border-black border-b h-6 w-full"/>
                              </tr>
                              <tr className="grid" style={{gridTemplateColumns: "1fr 2fr"}}>
                                   <td>Ամսաթիվ</td>
                                   <td className="border-black border-b h-6 w-full"/>
                              </tr>
                         </tbody>
                    </table>
               </div>
               <div className="w-full space-y-6">
                    {questions.map((question,i)=>{
                         const answers = ["ա","բ","գ","դ","ե","զ","է","ը"];
                         return (
                              <div key={i} className="w-full">
                                   <strong className="mb-3">{i+1}. {question.question}</strong>
                                   {question.description && <p>{quiz.description}</p>}
                                   {question.type==="text" ? (
                                        <div className="h-8 border-black border-b"/>
                                   ) : (
                                        <div className="grid grid-cols-2 gap-2">
                                             {question.answers.map((answer,i)=>(
                                                  <p key={answer.id}>{answers[i]}. {formatCorrectAnswer(answer.text)}</p>
                                             ))}
                                        </div>
                                   )}
                              </div>
                         )
                    })}
               </div>
          </div>
     )
}