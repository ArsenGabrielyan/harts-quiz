"use client"
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { CheckSquare, TextCursorInput } from "lucide-react";
import { redirect } from "next/navigation";
import {IoRadioButtonOn} from "react-icons/io5"

export default function QuizEditorPage(){
     const user = useCurrentUser();
     if(user?.accountType==="student") redirect("/");
     return (
          <PageLayout removeCreateButton>
               <div className="p-4 w-full bg-background border-b shadow flex items-center justify-start fixed top-[80px] left-0 gap-2 z-20">
                    <Button size="icon" variant="outline" title="Նշելով">
                         <CheckSquare/>
                    </Button>
                    <Button size="icon" variant="outline" title="Գրավոր">
                         <TextCursorInput/>
                    </Button>
                    <Button size="icon" variant="outline" title="Այո և Ոչ">
                         <IoRadioButtonOn/>
                    </Button>
               </div>
               <div className="mt-[70px]">
                    <div className="p-4 w-full bg-background border shadow rounded-xl"></div>
                    TODO: Recreate Quiz Editor and Make it Functional
               </div>
          </PageLayout>
     )
}