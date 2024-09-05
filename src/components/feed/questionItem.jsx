import { BtnLink } from "@/components/formComponents/button";

export default function QuestionItem({data, session}){
     return <div className="question">
     <h2>{data.name}</h2>
     <p>{data.teacher}&nbsp;&middot;&nbsp;{data.questions.length} Հարցեր</p>
     <div className="btns">
          {!session?.user?.accountType ? <BtnLink href={`/?id=${data.id}`} btnStyle="outline-blue">Խաղալ</BtnLink> : session?.user?.accountType!=='personal' ? <BtnLink href={session?.user?.accountType==='student' ? `/?id=${data.id}` : `/quiz?id=${data.id}`} btnStyle="outline-blue">{session?.user?.accountType==='student' ? "Խաղալ" : "Կազմակերպել"}</BtnLink> : <>
               <BtnLink href={`/?id=${data.id}`} btnStyle="outline-blue">Խաղալ</BtnLink>
               <BtnLink href={`/quiz?id=${data.id}`} btnStyle="outline-blue">Կազմակերպել</BtnLink>
          </>}
          <BtnLink href={`/feed/explore/${data.id}`} btnStyle="outline-blue">Իմանալ ավելին</BtnLink>
     </div>
     </div>
}