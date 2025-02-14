import { toast } from "sonner";
import { subjectList } from "./constants";
import { AccountType, IQuestion, ISubject, QuestionType } from "./types/other-types";
import { ReadonlyURLSearchParams } from "next/navigation";
import { QuizDocument } from "./types/mongoose-document-types";

export function getOAuthNotLinkedError(searchParams: ReadonlyURLSearchParams){
     const error = searchParams.get("error");
     if(error){
          return error.includes("OAuthAccountNotLinked") ? "Այս էլ․ փոստով արդեն կա հաշիվ, բայց այլ մուտքի մեթոդով։" : ""
     }
     return ""
}
export function generateUsername(prefix="user",length=8){
     const chars = "abcdefghijklmnopqrstuvwxyz0123456789-";
     let str = prefix+"-";
     for(let i=0;i<length;i++){
          const randI = Math.floor(Math.random()*chars.length);
          str+=chars[randI];
     }
     return str
}
export const getSocketUrl = () => process.env.NODE_ENV==="development" ? "http://localhost:4000" : "https://harts-quiz-backend.onrender.com"
export function getAnswerFormat(type: QuestionType){
     const result: Record<QuestionType, string[] | string> = {
          "pick-one": ["Ա","Բ","Գ","Դ"],
          "true-false": ["Այո", "Ոչ"],
          "text-answer": ""
     }
     return result[type] || null
}
export function getAnswerType(type: QuestionType){
     const result: Record<QuestionType, string> = {
          "pick-one": "Նշել Պատասխանը",
          "true-false": "Այո կամ ոչ",
          "text-answer": "Գրավոր հարց"
     }
     return result[type];
}
export function accTypeInArmenian(accountType: AccountType){
     const result: Record<AccountType, string> = {
          teacher: "Ուսուցիչ",
          student: "Աշակերտ",
          personal: "Անձնական",
     }
     return result[accountType]
}
export function getQuizDataFromType(type: QuestionType){
     const result: Record<QuestionType,IQuestion> = {
          "pick-one": {
               question: '',
               answers: ['','','',''],
               correct: null,
               timer: 0,
               points: 0,
               type,
               description: ""
          },
          "true-false": {
               question: '',
               answers: ['true','false'],
               correct: '',
               timer: 0,
               points: 0,
               type,
               description: ""
          },
          "text-answer": {
               question: '',
               correct: '',
               timer: 0,
               points: 0,
               type,
               description: ""
          }
     }
     return result[type];
}
export const formatNumberSuffix = (n: number) => n===1 ? `${n}-ին` : `${n}-րդ`;
export async function shareQuiz(url=location.href){
     const shareData = {
          title: 'Հարց',
          text: "Եկեք խաղացեք այս հարցաշարը",
          url
     }
     if(navigator.canShare(shareData)) await navigator.share(shareData)
     else {
          navigator.clipboard.writeText(location.href);
          toast.success("Հղումը պատճենված է")
     }
}
export function getSubjectInArmenian(subject: string): string{
     const currSubject = subjectList.find(val=>val.name===subject);
     return currSubject ? currSubject?.title : "";
}
export const absoluteUrl = (path: string) => `${process.env.NEXT_PUBLIC_BASE_URL}${path}`
export const divideQuestionsBySubject = (questions: QuizDocument[]) => questions.length===0 ? [] : Object.values(questions.reduce((obj,val)=>{
     const first = val.subject;
     console.log(first, obj);
     if(!obj[first]){
          obj[first] = {title: subjectList.find(v=>v.name===first)?.title as string, data: [val]}
     } else {
          obj[first].data.push(val)
     }
     return obj;
},{} as Record<string, { title: string, data: QuizDocument[] }>))
export const getFilteredSubjects = (list: ISubject[]=subjectList) => list.length===0 ? [] : Object.values(list.reduce((obj,val)=>{
     const first = val.type;
     !obj[first] ? obj[first] = {title: first, data: [val]} : obj[first].data.push(val)
     return obj;
},{} as Record<string, { title: string, data: ISubject[] }>))