import FormControl from "@/components/formComponents/frmControl";
import FormSelection from "@/components/formComponents/frmSelect";
import { getQuizDataFromType } from "@/lib/helpers";
import { useState } from "react";
import Button from "@/components/formComponents/button";
import { MdAdd, MdRemove } from "react-icons/md";
import ToggleSwitch from "@/components/formComponents/toggle-switch";

export default function QuizSideBar({formData, selectedQuestion, setFormData, onDelete, onDuplicate}){
     const currQuestion = formData.questions[selectedQuestion.index];
     const [count, setCount] = useState(currQuestion.type==='pick-one' ? currQuestion.answers.length : 0);
     const handleChangeQuestion = e => {
          const questionsCopy = [...formData.questions]
          const question = questionsCopy[selectedQuestion.index]
          questionsCopy[selectedQuestion.index] = {...question, [e.target.name]: +e.target.value}
          setFormData({...formData, questions: questionsCopy})
     }
     const updateType = (e)=>{
          const questionsCopy = [...formData.questions]
          const question = questionsCopy[selectedQuestion.index]
          const updatedQuestions = {
               ...getQuizDataFromType(e.target.value),
               question: question.question,
               correct: e.target.value==='text-answer' ? question.correct : e.target.value==='pick-one' ? null : '',
               image: question.image,
               timer: !question.timer ? '' : +question.timer,
               points: !question.timer ? '' : +question.points
          }
          questionsCopy[selectedQuestion.index] = updatedQuestions
          setCount(updatedQuestions.type==='pick-one' ? updatedQuestions.answers.length : 0)
          setFormData({...formData, questions: questionsCopy})
     }
     const handleSwitchPlaces = e => {
          const answers = e.target.checked ? ['false','true'] : ['true','false']
          const questionsCopy = [...formData.questions]
          const question = questionsCopy[selectedQuestion.index]
          questionsCopy[selectedQuestion.index] = {...question, answers};
          setFormData({...formData, questions: questionsCopy})
     }
     const handleIncrease = () =>{
          const questionsCopy = [...formData.questions]
          const question = questionsCopy[selectedQuestion.index]
          const updatedQuestions = {
               ...question,
               answers: [...question.answers,''],
               correct: null
          }
          questionsCopy[selectedQuestion.index] = updatedQuestions
          setFormData({...formData, questions: questionsCopy})
          setCount(prev=>prev+1)
     }
     const handleDecrease = () =>{
          const questionsCopy = [...formData.questions]
          const question = questionsCopy[selectedQuestion.index]
          const answerCopy = [...question.answers];
          answerCopy.pop();
          const updatedQuestions = {
               ...question,
               answers: answerCopy,
               correct: null
          }
          questionsCopy[selectedQuestion.index] = updatedQuestions
          setFormData({...formData, questions: questionsCopy})
          setCount(prev=>prev-1)
     }
     return <>
          <FormSelection name="type" title="Հարցի տեսակ" value={currQuestion.type} onChange={updateType}>
               <option value="pick-one">Նշելով</option>
               <option value="true-false">Այո և Ոչ</option>
               <option value="text-answer">Գրավոր</option>
          </FormSelection>
          <FormControl type="number" name="timer" title="Հարցի տևողությունը" value={currQuestion.timer} onChange={handleChangeQuestion} min={5} max={600}/>
          <FormControl type="number" name="points" title="Միավոր" value={currQuestion.points} onChange={handleChangeQuestion}/>
          {currQuestion.type==='true-false' && <ToggleSwitch title="Շրջել կոճակը" onChange={handleSwitchPlaces} name="switchPlaces"/>}
          {currQuestion.type==='pick-one' && <>
          <p className="label">Պատասխանների քանակը</p>
          <div className="counter">
               <Button btnStyle="icon-only outline-blue" disabled={count===2} onClick={handleDecrease}><MdRemove /></Button>
               <p className="count">{count}</p>
               <Button btnStyle="icon-only outline-blue" disabled={count===4} onClick={handleIncrease}><MdAdd /></Button>
          </div>
          </>}
          <div className="options">
               <Button btnStyle="outline-blue" onClick={onDuplicate}>Կրկնօրինակել</Button>
               <Button btnStyle="outline-red" onClick={onDelete}>Ջնջել</Button>
          </div>
     </>
}