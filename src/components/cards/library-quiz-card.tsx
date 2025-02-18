import { visibilities } from "@/data/constants";
import { QuizDocument } from "@/data/types";
import { Edit, CopyPlus, Trash, Share, Copy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { duplicateQuiz } from "@/actions/quiz/duplicateQuiz";
import { toast } from "sonner";
import { deleteQuiz } from "@/actions/quiz/deleteQuiz";
import { absoluteUrl, formatDate, shareQuiz } from "@/data/helpers";
import { useRouter } from "next/navigation";

export interface LibraryQuizCardProps{
     quiz: QuizDocument
}
export default function LibraryQuizCard({quiz}: LibraryQuizCardProps){
     const {questions,teacher,name,createdAt,id,visibility} = quiz
     const {name: visibilityName,Icon: VisibilityIcon} = visibilities[visibility];
     const router = useRouter();
     const handleDuplicateQuiz = () => {
          duplicateQuiz(quiz?.id || "")
          .then(data=>{
               if(data.error) toast.error(data.error)
               if(data.success) toast.success(data.success)
          })
          .catch(()=>toast.error("Վայ, մի բան սխալ տեղի ունեցավ"))
     }
     const handleDeleteQuiz = () => {
          if(confirm("Իսկապե՞ս ջնջել այս հարցաշարը")){
               deleteQuiz(quiz?.id || "")
               .then(data=>{
                    if(data.error) toast.error(data.error)
                    if(data.success) toast.success(data.success)
               })
               .catch(()=>toast.error("Վայ, մի բան սխալ տեղի ունեցավ"))
          }
     }
     const handleCopyLink = () => {
          navigator.clipboard.writeText(absoluteUrl(`/explore/${id}`))
          toast.success("Հղումը պատճենված է")
     }
     const handleClickInfo = () => {
          router.push(`/explore/${id}`)
     }
     return (
          <div className="p-4 border shadow bg-card rounded-xl flex justify-between items-center flex-col md:flex-row gap-4 text-center md:text-left">
               <div className="space-y-2 cursor-pointer" onClick={handleClickInfo}>
                    <h2 className="text-2xl font-semibold">{name}</h2>
                    <p className="text-muted-foreground">{teacher}&nbsp;&middot;&nbsp;{formatDate(createdAt)}</p>
                    <p className="text-muted-foreground">{questions.length} Հարց</p>
               </div>
               <div className="flex items-center gap-2">
                    <VisibilityIcon/>
                    {visibilityName}
               </div>
               <div className="flex justify-center items-center flex-wrap gap-2">
                    <Button variant="ghost" size="icon" title="Կիսվել" onClick={()=>shareQuiz()} className="flex-1">
                         <Share/>
                    </Button>
                    <Button variant="ghost" size="icon" title="Պատճենել հղումը" onClick={handleCopyLink} className="flex-1">
                         <Copy/>
                    </Button>
                    <Button variant="ghost" size="icon" title="Խմբագրել" asChild className="flex-1">
                         <Link href={`/quiz-editor?id=${quiz.id}`}><Edit/></Link>
                    </Button>
                    <Button variant="ghost" size="icon" title="Կրկնօրինակել" onClick={handleDuplicateQuiz} className="flex-1">
                         <CopyPlus/>
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-destructive flex-1" title="Ջնջել" onClick={handleDeleteQuiz}>
                         <Trash/>
                    </Button>
               </div>
          </div>
     )
}