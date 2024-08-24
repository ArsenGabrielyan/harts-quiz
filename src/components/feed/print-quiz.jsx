import Image from "next/image";
import { getSubjectInArmenian } from "@/lib/helpers";

export default function PrintQuiz({quiz}){
     return <>
     <div className="print-img"><Image src="/logos/logo.svg" alt="print-logo" width={150} height={50} /></div>
     <div className="print-header">
          <div className="info">
               <p>Առարկա՝ {getSubjectInArmenian(quiz.subject)}</p>
               <p>Թեմա՝ {quiz.name}</p>
               <p>Հարցի քանակը՝ {quiz.questions.length}</p>
          </div>
          <table className="fields">
               <tbody>
                    <tr>
                         <td>Անուն, Ազգանուն</td>
                         <td className="line"></td>
                    </tr>
                    <tr>
                         <td>Դասարան</td>
                         <td className="line"></td>
                    </tr>
                    <tr>
                         <td>Ամսաթիվ</td>
                         <td className="line"></td>
                    </tr>
               </tbody>
          </table>
     </div>
     <div className="print-questions">
          {quiz.questions.map((val,i)=>{
               const answers = ["ա","բ","գ","դ"]
               return <div className="question" key={i}>
                    <strong>{i+1}. {val.question}</strong>
                    {val.type==='text-answer' ? <div className="text-answer"/> : <div className="answers">
                         {val.answers.map((answer,i)=><p key={i}>{answers[i]}. {answer==='true' ? 'Այո' : answer==='false' ? 'Ոչ' : answer}</p>)}
                    </div>}
               </div>
          })}
     </div>
     </>
}