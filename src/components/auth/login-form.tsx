"use client"
import * as z from "zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form"
import { useSearchParams } from "next/navigation";
import {zodResolver} from "@hookform/resolvers/zod"
import { LoginSchema } from "@/lib/schemas";
import { CardWrapper } from "./card-wrapper";
import {
     Form,
     FormControl,
     FormField,
     FormItem,
     FormLabel,
     FormMessage
} from "@/components/ui/form"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { login } from "@/actions/auth/login";
import { getOAuthNotLinkedError } from "@/lib/helpers";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { LoginType } from "@/lib/types/schema";

export default function LoginForm(){
     const searchParams = useSearchParams();
     const callbackUrl = searchParams.get("callbackUrl")
     const urlError = getOAuthNotLinkedError(searchParams)
     const [showTwoFactor, setShowTwoFactor] = useState(false);
     const [error, setError] = useState<string | undefined>("");
     const [success, setSuccess] = useState<string | undefined>("");
     const [isPending, startTransition] = useTransition();
     const form = useForm<LoginType>({
          resolver: zodResolver(LoginSchema),
          defaultValues: {
               email: "",
               password: "",
               code: "",
          }
     });
     const handleSubmit = (values: LoginType) => {
          setError("");
          setSuccess("");
          startTransition(()=>{
               login(values,callbackUrl)
               .then(data=>{
                    if(data?.error){
                         form.reset();
                         setError(data?.error);
                    }
                    if(data?.success){
                         form.reset();
                         setSuccess(data?.success);
                    }
                    if(data?.twoFactor){
                         setShowTwoFactor(true);
                    }
               })
               .catch(()=>setError("Վայ, մի բան սխալ տեղի ունեցավ"))
          })
     }
     return (
          <CardWrapper
               headerLabel="Բարի գալուստ"
               backButtonLabel="Չունե՞ք հաշիվ։"
               backButtonHref="/auth/register"
               showSocial
          >
               <Form {...form}>
                    <form
                         onSubmit={form.handleSubmit(handleSubmit)}
                         className="space-y-6"
                    >
                         <div className="space-y-4">
                              {!showTwoFactor ? (
                                   <>
                                        <FormField
                                             control={form.control}
                                             name="email"
                                             render={({field})=>(
                                                  <FormItem>
                                                       <FormLabel>Էլ․ փոստ</FormLabel>
                                                       <FormControl>
                                                            <Input
                                                                 {...field}
                                                                 disabled={isPending}
                                                                 placeholder="name@example.com"
                                                                 type="email"
                                                            />
                                                       </FormControl>
                                                       <FormMessage/>
                                                  </FormItem>
                                             )}
                                        />
                                        <FormField
                                             control={form.control}
                                             name="password"
                                             render={({field})=>(
                                                  <FormItem>
                                                       <FormLabel>Գաղտնաբառ</FormLabel>
                                                       <FormControl>
                                                            <Input
                                                                 {...field}
                                                                 placeholder="********"
                                                                 disabled={isPending}
                                                                 type="password"
                                                            />
                                                       </FormControl>
                                                       <Button size="sm" variant="link" asChild className="px-0 font-normal">
                                                            <Link href="/auth/reset">Մոռացե՞լ եք գաղտնաբառը։</Link>
                                                       </Button>
                                                       <FormMessage/>
                                                  </FormItem>
                                             )}
                                        />
                                   </>
                              ) : (
                                   <FormField
                                        control={form.control}
                                        name="code"
                                        render={({field})=>(
                                             <FormItem>
                                                  <FormLabel>Վավերացման կոդ</FormLabel>
                                                  <FormControl>
                                                       <InputOTP maxLength={6} {...field} disabled={isPending}>
                                                            <InputOTPGroup>
                                                                 <InputOTPSlot index={0}/>
                                                                 <InputOTPSlot index={1}/>
                                                                 <InputOTPSlot index={2}/>
                                                                 <InputOTPSlot index={3}/>
                                                                 <InputOTPSlot index={4}/>
                                                                 <InputOTPSlot index={5}/>
                                                            </InputOTPGroup>
                                                       </InputOTP>
                                                  </FormControl>
                                                  <FormMessage/>
                                             </FormItem>
                                        )}
                                   />
                              )}
                         </div>
                         <FormError message={error || urlError}/>
                         <FormSuccess message={success}/>
                         <Button type="submit" className="w-full" disabled={isPending}>{isPending ? "Խնդրում ենք սպասել..." : showTwoFactor ? 'Հաստատել' : "Մուտք"}</Button>
                    </form>
               </Form>
          </CardWrapper>
     )
}