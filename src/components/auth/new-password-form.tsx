"use client"
import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { NewPasswordSchema } from "@/schemas";
import { CardWrapper } from "./card-wrapper";
import {
     Form,
     FormControl,
     FormField,
     FormItem,
     FormLabel,
     FormMessage
} from "@/components/ui/form"
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { PasswordStrengthInput } from "../password-input";
import { useSearchParams } from "next/navigation";
import { newPassword } from "@/actions/auth/new-password";

export default function NewPasswordForm(){
     const [isPending, startTransition] = useTransition();
     const [error, setError] = useState<string | undefined>("");
     const [success, setSuccess] = useState<string | undefined>("");
     const form = useForm<z.infer<typeof NewPasswordSchema>>({
          resolver: zodResolver(NewPasswordSchema),
          defaultValues: {
               password: ''
          }
     });
     const searchParams = useSearchParams();
     const token = searchParams.get("token");
     const handleSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
          setError("");
          setSuccess("");
          startTransition(()=>{
               newPassword(values,token)
               .then(data=>{
                    setError(data?.error);
                    setSuccess(data?.success);
               })
          })
     }
     return (
          <CardWrapper
               headerLabel="Ստեղծել նոր գաղտնաբառ։"
               backButtonLabel="Վերադառնալ մուտք"
               backButtonHref="/auth/login"
          >
               <Form {...form}>
                    <form
                         onSubmit={form.handleSubmit(handleSubmit)}
                         className="space-y-6"
                    >
                         <div className="space-y-4">
                              <FormField
                                   control={form.control}
                                   name="password"
                                   render={({field})=>(
                                        <FormItem>
                                             <FormLabel>Գաղտնաբառ</FormLabel>
                                             <FormControl>
                                                  <PasswordStrengthInput
                                                       {...field}
                                                       disabled={isPending}
                                                       placeholder="********"
                                                  />
                                             </FormControl>
                                             <FormMessage/>
                                        </FormItem>
                                   )}
                              />
                         </div>
                         <FormError message={error}/>
                         <FormSuccess message={success}/>
                         <Button type="submit" className="w-full" disabled={isPending}>{isPending ? "Խնդրում ենք սպասել..." : "Վերականգնել գաղտնաբառը"}</Button>
                    </form>
               </Form>
          </CardWrapper>
     )
}