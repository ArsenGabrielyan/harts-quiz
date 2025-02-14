"use client"
import { CardWrapper } from "./card-wrapper";
import { TriangleAlert } from "lucide-react";

export const ErrorCard = () => {
     return (
          <CardWrapper
               headerLabel="Վայ, մի բան սխալ տեղի ունեցավ։"
               backButtonHref="/auth/login"
               backButtonLabel="Վերադառնալ մուտք"
          >
               <div className="w-full flex justify-center items-center">
                    <TriangleAlert className="text-destructive"/>
               </div>
          </CardWrapper>
     )
}