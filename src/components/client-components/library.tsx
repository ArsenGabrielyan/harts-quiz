"use client"

import { QuizDocument } from "@/data/types/mongoose-document-types"
import PageLayout from "../page-layout"
import LibraryQuizCard from "../cards/library-quiz-card"

interface LibraryQuizListProps{
     quizzes: QuizDocument[] | null
}
export default function LibraryQuizList({quizzes}: LibraryQuizListProps){
     return (
          <PageLayout>
               <h1 className="text-3xl md:text-4xl text-center">Ձեր հարցաշարերը</h1>
               <div className="w-full space-y-4 mt-4">
                    {quizzes && quizzes.map(quiz=>(
                         <LibraryQuizCard key={quiz._id} quiz={quiz}/>
                    ))}
               </div>
          </PageLayout>
     )
}