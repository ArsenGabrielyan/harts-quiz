import NewPasswordForm from "@/components/auth/new-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
     title: "Ստեղծել նոր գաղտնաբառ | Հարց"
}

export default function NewPasswordPage(){
     return (
          <NewPasswordForm />
     )
}