"use client"
import { CardWrapper } from "./card-wrapper"
import { GridLoader } from "react-spinners"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { newVerification } from "@/actions/auth/new-verification"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"

export const NewVerificationForm = () => {
     const [error, setError] = useState<string | undefined>("");
     const [success, setSuccess] = useState<string | undefined>("");

     const searchParams = useSearchParams();
     const token = searchParams.get("token");
     
     const onSubmit = useCallback(()=>{
          if(success || error) return;
          if(!token) {
               setError("Բացակայում է հաստատման token-ը");
               return;
          }
          newVerification(token)
          .then(data=>{
               setSuccess(data.success);
               setError(data.error)
          })
          .catch(()=>{
               setError("Վայ, մի բան սխալ տեղի ունեցավ")
          })
     },[token, success, error])

     useEffect(()=>{
          onSubmit()
     },[onSubmit])

     return (
          <CardWrapper
               headerLabel="Հաստատում ենք ձեր էլ․ փոստը"
               backButtonHref="/auth/login"
               backButtonLabel="Վերադառնալ մուտք"
          >
               <div className="flex items-center justify-center w-full">
                    {!success && !error && (
                         <GridLoader color="hsl(var(--primary))"/>
                    )}
                    <FormSuccess message={success}/>
                    {!success && (
                         <FormError message={error}/>
                    )}
               </div>
          </CardWrapper>
     )
}