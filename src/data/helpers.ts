import { toast } from "sonner";
import { subjectList } from "./constants";
import { AccountType, IQuestionState, ISubject, QuestionType, SubjectName } from "./types";
import { ReadonlyURLSearchParams } from "next/navigation";
import { QuizDocument } from "./types";
import axios from "axios";

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
          "pick_one": ["Ա","Բ","Գ","Դ","Ե","Զ"],
          "true_false": ["Այո", "Ոչ"],
          "text": ""
     }
     return result[type]
}
export function getAnswerType(type: QuestionType){
     const result: Record<QuestionType, string> = {
          "pick_one": "Նշել Պատասխանը",
          "true_false": "Այո կամ ոչ",
          "text": "Գրավոր հարց"
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
export function getSubjectInArmenian(subject: SubjectName): string{
     const currSubject = subjectList.find(val=>val.name===subject);
     return currSubject ? currSubject?.title : "";
}
export const absoluteUrl = (path: string) => `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
export const divideQuestionsBySubject = (questions: QuizDocument[]) => questions.length===0 ? [] : Object.values(questions.reduce((obj,val)=>{
     const first = val.subject;
     if(!obj[first]){
          obj[first] = {title: subjectList.find(v=>v.name===first)?.title as string, data: [val]}
     } else {
          obj[first].data.push(val)
     }
     return obj;
},{} as Record<string, { title: string, data: QuizDocument[] }>))
export const getFilteredSubjects = (list: ISubject[]=subjectList) => list.length===0 ? [] : Object.values(list.reduce((obj,val)=>{
     const first = val.type;
     if(!obj[first]){
          obj[first] = {title: first, data: [val]}
     } else {
          obj[first].data.push(val)
     }
     return obj;
},{} as Record<string, { title: string, data: ISubject[] }>))
export const getInitialAnswers = (type: QuestionType) => ({
     answers: type==="text" ? [] : type==="true_false" ? ["true", "false"] : ["","","",""],
     correct: ""
})
export async function fetcher(url: string){
     const res = await axios.get(url);
     return res.data;
}
export const getButtonVariantDependingOnAnswer = (
     answer: string,
     correct: string,
     mode: "multiplayer" | "one-player",
     state: IQuestionState
) => {
     const {currAnswer,currTime} = state
     const hasNoAnswer = mode==="multiplayer" ? (currAnswer==="" || currTime>0) : currAnswer==="";
     if(hasNoAnswer)
          return "outline"
     else if(answer===correct)
          return "success";
     else if(answer===currAnswer)
          return "destructive";
     return "outline"
}
export const playSound = (soundName: string,onError?:(message: string) => void) => {
     const path = `/sounds/${soundName}`
     const audio = new Audio(path);
     audio.play().catch((error)=>{
          if(onError) onError("Չհաջողվեց միացնել Ձայնը")
          console.error(error)
     })
}
export const generateGameCode = () => {
     const chars = "0123456789";
     let str = "";
     for(let i=0;i<8;i++){
          const randI = Math.floor(Math.random()*chars.length);
          str += chars[randI];
     }
     return str;
}
export const formatCorrectAnswer = (correct: string) => correct==="true" ? "Այո" : correct==="false" ? "Ոչ" : correct
export function formatDate(date: Date){
     const d = new Date(date);
     const month = (d.getMonth()+1).toString().padStart(2,"0");
     const day = d.getDate().toString().padStart(2,"0");
     const year = d.getFullYear();
     return `${day}-${month}-${year}`
}