import { shareQuiz } from "@/lib/helpers";
import Button from "@/components/formComponents/button";
import { MdDelete, MdEdit, MdFavorite, MdShare } from "react-icons/md";
import { BiDuplicate } from "react-icons/bi";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";

export default function LibraryQuiz({data, updateQuiz, updateUser, session, currUser}){
     const {name, teacher,id} = data;
     const router = useRouter();
     const duplicateQuiz = async()=>{
          const res = await toast.promise(axios.post("/api/questions",{reqType: 'duplicate',quizId: id}),{
               pending: "Հարցաշարը կրկնօրինակվում է։ Խնդրում ենք սպասել...",
               success: 'Հարցաշարը կրկնօրինակված է',
               error: "Չհաջողվեց կրկնօրինակել հարցաշարը"
          });
          if(res.status===200) await updateQuiz();
     }
     const deleteQuiz = async() => {
          if(confirm("Վստա՞հ ես")){
               const res = await toast.promise(axios.delete(`/api/questions?id=${id}`),{
                    pending: 'Հարցաշարը ջնջվում է։ Խնդրում ենք սպասել...',
                    success: 'Հարցաշարը ջնջված է',
                    error: "Չհաջողվեց ջնջել հարցաշարը"
               })
               if(res.status===200) await updateQuiz();
          }
     }
     const likeQuiz = async()=>{
          const res = await axios.patch("/api/questions",{email: session?.user?.email, quizId: id});
          if(res.status===200) await updateUser();
     }
     const isLiked = currUser?.favorites?.includes(id);
     return <div className="lib-quiz">
          <div className="quiz-info" onClick={()=>router.push(`/feed/explore/${id}`)}>
               <h2>{name}</h2>
               <p>{teacher}</p>
          </div>
          <div className="quiz-details">
               <Button onClick={()=>shareQuiz(`http://localhost:3000/feed/explore/${id}`)} customClass="optBtn" title="Կիսվել"><MdShare /></Button>
               <Button onClick={likeQuiz} customClass={`optBtn ${isLiked ? 'active' : ''}`.trim()} title={isLiked ? 'Չհավանել' : 'Հավանել'}><MdFavorite /></Button>
               <Link href={`/quizEditor?quizId=${id}`} className="optBtn" title="Խմբագրել"><MdEdit /></Link>
               <Button onClick={duplicateQuiz} customClass="optBtn" title="Կրկնօրինակել"><BiDuplicate /></Button>
               <Button onClick={deleteQuiz} customClass="optBtn red" title="Ջնջել"><MdDelete /></Button>
          </div>
     </div>
}