import ResetForm from "@/components/auth/reset-form";
import { Metadata } from "next";

export const metadata: Metadata = {
     title: "Վերականգնել գաղտնաբառը | Հարց"
}

export default function ResetPage(){
     return (
          <ResetForm/>
     )
}