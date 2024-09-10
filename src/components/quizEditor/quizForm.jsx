import FormControl from "@/components/formComponents/frmControl";
import { useEffect, useRef, useState } from "react";
import { FaImage } from "react-icons/fa";
import { MdCheckCircle } from "react-icons/md";
import Button from "@/components/formComponents/button";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/tools/firebase";
import { Grid } from "react-loader-spinner";

export default function QuizForm({data, id, setQuestions, onSelect, selected, mainQuizId, index, totalQuestions}){
     const [formData, setFormData] = useState(data);
     const [isUploading, setIsUploading] = useState(false)
     const imageRef = useRef(null);
     const handleChange = e => {
          const newVal = {...formData, [e.target.name]: e.target.value}
          setFormData(newVal);
          setQuestions(newVal)
     }
     const handleChangeAnswer = (e,i) => {
          const newInputs = [...formData.answers];
          newInputs[i] = e.target.value;
          setQuestions({...formData, answers: newInputs})
     }
     const changeCorrect = answer => {
          if(formData.answers.every(val=>val!=='')){
               const newData = {...formData, correct: answer}
               setFormData(newData)
               setQuestions(newData)
          }
     }
     const handleUploadImage = async e =>{
          if(!e.target.files[0]) return;
          setIsUploading(true);
          const file = e.target.files[0]
          const imgRef = ref(storage,`quizzes/${mainQuizId}/question-${index}`);
          await uploadBytes(imgRef,file)
          getDownloadURL(imgRef).then(val=>{
               setIsUploading(false);
               setQuestions({...formData, image: val})
          })
     }
     useEffect(()=>{
          setFormData(data)
     },[data])
     return <div className={`quiz ${selected ? 'active' : ''}`.trim()} id={id} onClick={()=>onSelect(formData)}>
          <FormControl name="question" title="Հարց" value={formData.question} onChange={handleChange}/>
          {(isUploading || !formData.image) ? <div className={`image ${isUploading ? 'disabled' : ''}`.trim()} onClick={()=>imageRef.current?.click()}>
               {isUploading ? <Grid height={120} width={120} color="#002a4f"/> : <>
                    <FaImage />
                    <h2>Տեղադրել Նկար</h2>
               </>}
               <input type="file" name="image" ref={imageRef} onChange={handleUploadImage} accept="image/*"/>
          </div> : <div className="imgPreview" style={{backgroundImage: `url('${formData.image}')`}}>
               <p className="overlay" onClick={()=>imageRef.current?.click()}>Փոխել նկարը</p>
               <input type="file" name="image" ref={imageRef} onChange={handleUploadImage} accept="image/*"/>   
          </div>}
          <FormControl type="textarea" name="description" title="Նկարագրություն" value={formData.description} onChange={handleChange} />
          <div className={`answers ${formData.type}`}>
               {formData.type==='pick-one' ? <>
               {formData.answers.map((answer,i)=><div className="answer" key={i}>
                    <Button customClass={`correctBtn ${formData.correct===answer ? 'active' : ''}`.trim()} onClick={()=>changeCorrect(answer)}><MdCheckCircle /></Button>
                    <FormControl name="answer1" title={`Պատասխան ${i+1}`} value={answer} onChange={(e)=>handleChangeAnswer(e,i)}/>
               </div>)}
          </> : formData.type === 'true-false' ? <>
               {formData.answers.map((answer,i)=><Button key={i} btnStyle={`outline-blue ${formData.correct===answer ? 'active' : ''}`.trim()} onClick={()=>changeCorrect(answer)}>{answer==='true' ? 'Այո' : 'Ոչ'}</Button>)}
          </> : <FormControl name="correct" title="Ճիշտ պատասխան" value={formData.correct} onChange={handleChange}/>}
          </div>
          <p>{index}/{totalQuestions}</p>
     </div>
}