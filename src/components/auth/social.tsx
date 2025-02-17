"use client";
import {FcGoogle} from "react-icons/fc"
import {FaFacebook} from "react-icons/fa"
import { Button } from "../ui/button";
import { signIn } from "next-auth/react"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useSearchParams } from "next/navigation";

export const Social = () => {
     const searchParams = useSearchParams();
     const callbackUrl = searchParams.get("callbackUrl")
     const onClick = (provider: "google" | "facebook") => {
          signIn(provider,{
               callbackUrl: callbackUrl ||DEFAULT_LOGIN_REDIRECT
          })
     }
     return (
          <div className="flex items-center w-full gap-x-2">
               <Button size="lg" className="w-full" variant="outline" onClick={()=>onClick("google")}>
                    <FcGoogle className="h-5 w-5"/>
               </Button>
               <Button size="lg" className="w-full text-[#3b5999]" variant="outline" onClick={()=>onClick("facebook")}>
                    <FaFacebook className="h-5 w-5"/>
               </Button>
          </div>
     )
}