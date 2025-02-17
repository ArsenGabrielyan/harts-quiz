import LoginForm from "@/components/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
     title: "Մուտք | Հարց"
}

export default function LoginPage(){
     return (
          <LoginForm/>
     )
}