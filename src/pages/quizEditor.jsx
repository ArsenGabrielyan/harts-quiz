import FeedLayout from "@/components/feed/FeedLayout";
import Button from "@/components/formComponents/button";
import FormControl from "@/components/formComponents/frmControl";
import { getSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import QuizForm from "@/components/quizEditor/quizForm";
import { deleteFolder, folderExists, generateId, getQuizDataFromType, startEditing } from "@/lib/helpers";
import MainSideBar from "@/components/quizEditor/MainSidebar";
import QuizSideBar from "@/components/quizEditor/QuizSidebar";
import { validateQuizEditor } from "@/lib/formData";
import { toast } from "react-toastify";
import axios from "axios";
import connectDB from "@/lib/tools/connectDb";
import HartsQuiz from "@/model/Quiz";
import { useRouter } from "next/router";
import { INITIAL_QUIZEDITOR_DATA, INITIAL_SELECTED_QUIZ } from "@/lib/constants";

export default function QuizEditor({session,quiz}){
     const [formData, setFormData] = useState(!quiz ? INITIAL_QUIZEDITOR_DATA : quiz)
     const [selectedQuestion, setSelectedQuestion] = useState(INITIAL_SELECTED_QUIZ)
     const [isLoading, setIsLoading] = useState(false);
     const router = useRouter()
     const addQuiz = type => {
          const questionsCopy = [...formData.questions];
          const data = getQuizDataFromType(type);
          questionsCopy.push(data);
          setFormData({...formData, questions: questionsCopy})
     }
     const setQuestions = (question,i) => {
          const questionsCopy = [...formData.questions];
          questionsCopy[i] = question;
          setFormData({...formData, questions: questionsCopy})
     }
     const handleChange = e => setFormData({...formData,[e.target.name]: e.target.value});
     const handleSelection = (question,i) => setSelectedQuestion({question,index: i})
     const handleDuplicate = (i,val)=>{
          const q = [...formData.questions];
          const question = {...val, id: generateId(8)}
          q.splice(i,0,question);    
          setFormData(prev=>({...prev, questions: q}))
     }
     const handleDelete = (i)=>{
          const q = [...formData.questions];
          q.splice(i,1);    
          setFormData(prev=>({...prev, questions: q}))
          setSelectedQuestion({question: {},index: null})
     }
     const handleSave = async () => {
          let msg = validateQuizEditor(formData);
          if(msg===''){
               try{
                    setIsLoading(true);
                    const res = quiz ? await axios.put("/api/questions",{quizData: formData}) : await axios.post("/api/questions",{quizData: formData, email: session?.user?.email})
                    if(res.status===200){
                         setIsLoading(false);
                         setSelectedQuestion({question: {},index: null});
                         toast.success(`Հարցաշարը ${quiz ? 'Խմբագրված է' : formData.visibility==='public' ? 'Հրատարակված է' : 'Պահպանված է'}`)
                         if(quiz) setTimeout(()=>router.push(`/feed/explore/${quiz.id}`),3000)
                         else setFormData({...INITIAL_QUIZEDITOR_DATA, id: generateId(12,'username')});
                    }
               } catch (e){
                    const errMsg = e.response ? e.response.data.message : e.message;
                    toast.error(errMsg);
                    setIsLoading(false)
               }
          } else toast.error(msg);
     }
     const handleReset = async() => {
          if(await folderExists(`quizzes/${formData.id}`)) await deleteFolder(`quizzes/${formData.id}`)
          setFormData(!quiz ? INITIAL_QUIZEDITOR_DATA : quiz);
          setSelectedQuestion(INITIAL_SELECTED_QUIZ);
     }
     useEffect(()=>{
          const handleClick = e => {
               if(e.target.className && typeof e.target.className==='string'){
                    const condition = e.target.className.includes('quiz') || e.target.className==='editor-sidebar' || e.target.nodeName==='INPUT' || e.target.className==='slider' || e.target.nodeName==='BUTTON'
                    if(!condition) setSelectedQuestion({question: {},index: null})
               }
          }
          document.addEventListener('click',handleClick);
          return () => {
               document.removeEventListener('click',handleClick);
          }
     },[])
     const isUnchanged = useMemo(()=>(quiz && JSON.stringify(quiz)===JSON.stringify(formData)),[formData,quiz])
     return <FeedLayout enableCreateBtn={false}>
          <div className="quizEditor">
               <div className="infoForm">
                    <FormControl title="Հարցաշարի անունը" name="name" value={formData.name} onChange={handleChange}/>
                    <div className="options">
                         <Button btnStyle="outline-blue" onClick={handleReset} disabled={isUnchanged || JSON.stringify(INITIAL_QUIZEDITOR_DATA)===JSON.stringify(formData)}>Չեղարկել</Button>
                         <Button btnStyle="blue" onClick={handleSave} disabled={isUnchanged || isLoading}>{isLoading ? "Բեռնվում է․․․" : quiz ? "Հաստատել" : formData.visibility==='public' ? 'Հրատարակել' : 'Պահպանել'}</Button>
                    </div>
               </div>
               <div className="editor-container">
                    <div className="editor">
                         {formData.questions.length===0 ? <h2>Ավելացնել Հարց</h2> : formData.questions.map((q,i)=><QuizForm key={q.id} data={q} id={q.id} setQuestions={val=>setQuestions(val,i)} onSelect={val=>handleSelection(val,i)} selected={selectedQuestion.index===i} mainQuizId={formData.id} index={i+1}/>)}
                    </div>
                    <aside className="editor-sidebar">
                         {JSON.stringify(selectedQuestion.question)==='{}' && <MainSideBar addQuiz={addQuiz} handleChange={handleChange} formData={formData} />}
                         {JSON.stringify(selectedQuestion.question)!=='{}' && <QuizSideBar formData={formData} setFormData={setFormData} selectedQuestion={selectedQuestion} onDuplicate={()=>handleDuplicate(selectedQuestion.index,selectedQuestion.question)} onDelete={()=>handleDelete(selectedQuestion.index)}/>}
                    </aside>
               </div>
          </div>
     </FeedLayout>
}
export const getServerSideProps = async ctx => {
     const session = await getSession(ctx)
     const {quizId} = ctx.query;
     let quiz;
     if(quizId){
          await connectDB();
          quiz = JSON.parse(JSON.stringify(await HartsQuiz.findOne({id: quizId})));
     }
     if(!session){
          return {redirect: {
               destination: '/auth/signin',
               permanent: false,
          }}
     }
     if((quiz && quiz.teacherEmail!==session?.user?.email) || session?.user?.accountType === 'student'){
          return {redirect: {
               destination: '/feed',
               permanent: false,
          }}
     }
     return (quiz && quiz.teacherEmail===session?.user?.email) ? {props: {session,quiz: startEditing(quiz)}} : {props: {session}}
}