import { toast } from "sonner";
import { SUBJECT_LIST } from "./constants/others";
import {ACCOUNT_TYPES, ANSWER_FORMATS, ANSWER_TYPES} from "./constants/mappings"
import { IQuestionState, SubjectName } from "./types";
import { AccountType, QuestionType } from "@prisma/client";
import { ReadonlyURLSearchParams } from "next/navigation";
import axios from "axios";

const generateRandomString = (chars: string, length: number) => {
     let result = "";
     for (let i = 0; i < length; i++) {
          const randI = Math.floor(Math.random() * chars.length);
          result += chars[randI];
     }
     return result;
};
export const getOAuthNotLinkedError = (searchParams: ReadonlyURLSearchParams) => {
     const error = searchParams.get("error") || "";
     return error.includes("OAuthAccountNotLinked") ? "Այս էլ․ փոստով արդեն կա հաշիվ, բայց այլ մուտքի մեթոդով։" : ""
}
export const generateUsername = (prefix="user",length=8) => {
     const chars = "abcdefghijklmnopqrstuvwxyz0123456789-";
     return `${prefix}-${generateRandomString(chars,length)}`
}
export const getAnswerFormat = (type: QuestionType) => ANSWER_FORMATS[type]
export const getAnswerType = (type: QuestionType) => ANSWER_TYPES[type];
export const accTypeInArmenian = (accountType: AccountType) => ACCOUNT_TYPES[accountType]
export const formatNumberSuffix = (n: number) => n===1 ? `${n}-ին` : `${n}-րդ`;
export const shareQuiz = async (url=location.href) => {
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
export const getSubjectInArmenian = (subject: SubjectName): string => {
     const currSubject = SUBJECT_LIST.find(val=>val.name===subject);
     return currSubject ? currSubject.title : "";
}
export const absoluteUrl = (path: string) => `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
export function groupBy<T, K extends string | number>(
     arr: T[],
     getKey: (item: T) => K,
     getTitle: (key: K) => string
): {title: string, data: T[]}[]{
     if(arr.length===0) return [];
     return Object.values(arr.reduce((acc,item)=>{
          const key = getKey(item)
          if(!acc[key]){
               acc[key] = {title: getTitle(key), data: [item]}
          } else {
               acc[key].data.push(item)
          }
          return acc;
     },{} as Record<K, {title: string, data: T[]}>))
}
export const getFilteredSubjects = () => groupBy(SUBJECT_LIST,subject=>subject.type,type=>type);
export const getInitialAnswers = (type: QuestionType) => ({
     answers: type==="text" ? [] : type==="true_false" ? ["true", "false"] : ["","","",""],
     correct: ""
})
export const fetcher = async (url: string) => {
     try{
          const res = await axios.get(url);
          return res.data;
     } catch(err) {
          console.error(err);
     }
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
     return generateRandomString(chars,8)
}
export const formatCorrectAnswer = (correct: string) => correct==="true" ? "Այո" : correct==="false" ? "Ոչ" : correct
export const formatDate = (date: Date) => {
     const month = (date.getMonth()+1).toString().padStart(2,"0");
     const day = date.getDate().toString().padStart(2,"0");
     const year = date.getFullYear();
     return `${day}-${month}-${year}`
}