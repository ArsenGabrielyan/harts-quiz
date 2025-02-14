import { NewVerificationForm } from "@/components/auth/new-verification-form";
import { Metadata } from "next";

export const metadata: Metadata = {
     title: "Հաստատեք ձեր էլ․ փոստը | Հարց"
}

export default function NewVerificationPage(){
     return (
          <NewVerificationForm />
     )
}