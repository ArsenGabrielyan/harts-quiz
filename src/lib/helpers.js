import { MdFace, MdTagFaces } from "react-icons/md"
import { FaFemale, FaMale, FaHatCowboySide, FaEye, FaTshirt } from "react-icons/fa"
import { IoEar, IoGlasses } from 'react-icons/io5'
import {GiNoseFront} from "react-icons/gi"
import {CgSmileMouthOpen} from "react-icons/cg";
import { toast } from "react-toastify";
import axios from "axios";
import { subjectList } from "./constants";
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { storage } from "./tools/firebase";

export function generateId(length, type=''){
     const chars = type==='username' ? 'abcdefghijklmnopqrstuvwxyz0123456789' : 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
     let generated = ''
     for(let i=0;i<=length;i++){
          const charIndex = Math.floor(Math.random()*chars.length);
          generated += chars.substring(charIndex,charIndex+1)
     }
     return generated
}
export const getAllStyles = gender => [
     {name: 'hairStyle', icon: <MdFace/>},
     {name: 'faceColor', icon: <MdTagFaces/>},
     {name: 'sex', icon: gender==='man' ? <FaMale/> : <FaFemale/>},
     {name: 'earSize', icon: <IoEar/>},
     {name: 'hatStyle', icon: <FaHatCowboySide/>},
     {name: 'eyeStyle', icon: <FaEye/>},
     {name: 'glassesStyle', icon: <IoGlasses/>},
     {name: 'noseStyle', icon: <GiNoseFront/>},
     {name: 'mouthStyle', icon: <CgSmileMouthOpen/>},
     {name: 'shirtStyle', icon: <FaTshirt/>}
]
export function getAnswerFormat(type){
     let answerFormat = null;
     switch(type){
          case 'pick-one': answerFormat = ["Ա","Բ","Գ","Դ"]; break;
          case "true-false": answerFormat = ["Այո", "Ոչ"]; break;
          case "text-answer": answerFormat = ''; break;
          default: console.error('Invalid Type');
     }
     return answerFormat
}
export const getSocketUrl = () => process.env.NODE_ENV==="development" ? "http://localhost:4000" : "https://harts-quiz-backend.onrender.com"
export function getAnswerType(type){
     switch(type){
          case 'pick-one': return "Նշել Պատասխանը"
          case "true-false": return "Այո կամ ոչ"
          case "text-answer": return "Գրավոր հարց"
          default: console.error('Invalid Type');
     }
}
export function accTypeInArmenian(accountType){
     switch(accountType){
          case "teacher": return "Ուսուցիչ"
          case "student": return "Աշակերտ"
          case "personal": return "Անձնական"
     }
}
export function getQuizDataFromType(type){
     switch(type){
          case 'pick-one': return {
               question: '',
               answers: ['','','',''],
               correct: null,
               image: null,
               timer: '',
               points: '',
               type,
               id: generateId(8),
               description: ""
          };
          case "true-false": return {
               question: '',
               answers: ['true','false'],
               correct: '',
               image: null,
               timer: '',
               points: '',
               type,
               id: generateId(15),
               description: ""
          };
          case "text-answer": return {
               question: '',
               correct: '',
               image: null,
               timer: '',
               points: '',
               type,
               id: generateId(15),
               description: ""
          };
     }
}
export const formatNumberSuffix = n => n===1 ? `${n}-ին` : `${n}-րդ`;
export function startEditing(quiz){
     const questionsCopy = [...quiz.questions];
     return {...quiz, questions: questionsCopy.map(val=>({...val, id: generateId(15)}))}
}
export async function shareQuiz(url=location.href){
     const shareData = {
          title: 'Հարց',
          text: "Եկեք խաղացեք այս հարցաշարը",
          url
     }
     if(navigator.canShare(shareData)) await navigator.share(shareData)
     else {
          navigator.clipboard.writeText(location.href);
          toast.success('Հղումը պատճենված է');
     }
}
export function getSubjectInArmenian(subject){
     const currSubject = subjectList.find(val=>val.name===subject);
     return currSubject.title;
}
export async function fetcher(url){
     const res = await axios.get(url);
     return res.data
}
export function imageToBase64(img){
     return new Promise(resolve=>{
          let baseUrl = ''
          const reader = new FileReader();
          reader.readAsDataURL(img);
          reader.onload = ()=>{
               baseUrl = reader.result;
               resolve(baseUrl);
          }
     })
}
export const getFilteredSubjects = list => list.length===0 ? [] : Object.values(list.reduce((obj,val)=>{
     const first = val.type;
     !obj[first] ? obj[first] = {title: first, data: [val]} : obj[first].data.push(val)
     return obj;
},{}))
export async function checkIfFileExists(filePath){
     const fileRef = ref(storage,filePath);
     return getDownloadURL(fileRef).then(()=>Promise.resolve(true)).catch(err=>{
          if(err.code==='storage/object-not-found'){
               return Promise.resolve(false)
          } else {
               return Promise.reject(err)
          }
     })
}
export async function deleteFolder(folderPath){
     const folderRef = ref(storage,folderPath);
     try{
          const results = await listAll(folderRef);
          if(!results.items){
               throw new Error("No Items Found");
          }
          await Promise.all(results.items.map(val=>deleteObject(val)))
     } catch(err){
          console.error("Error Deleting Folder, Message: "+err.message)
     }
}
export async function folderExists(folderPath){
     const folderRef = ref(storage,folderPath);
     try{
          const results = await listAll(folderRef);
          const result = results.items.every(async val=>{
               return getDownloadURL(val).then(()=>Promise.resolve(true)).catch(err=>{
                    if(err.code==='storage/object-not-found'){
                         return Promise.resolve(false)
                    } else {
                         return Promise.reject(err)
                    }
               })
          })
          return result
     } catch(err){
          console.error("Error Duplicating Folder, Message: "+err.message)
     }
}
export const divideQuestionsBySubject = questions => questions.length===0 ? [] : Object.values(questions.reduce((obj,val)=>{
     const first = val.subject;
     !obj[first] ? obj[first] = {title: subjectList.find(v=>v.name===first).title, data: [val]} : obj[first].data.push(val)
     return obj;
},{}))
export const absoluteUrl = path => `${process.env.NEXT_PUBLIC_BASE_URL}${path}`