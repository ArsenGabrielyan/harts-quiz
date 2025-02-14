"use client"
import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { ResetSchema } from "@/schemas";
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
import { reset } from "@/actions/auth/reset";

export default function ResetForm(){
     const [isPending, startTransition] = useTransition();
     const [error, setError] = useState<string | undefined>("");
     const [success, setSuccess] = useState<string | undefined>("");
     const form = useForm<z.infer<typeof ResetSchema>>({
          resolver: zodResolver(ResetSchema),
          defaultValues: {
               email: ""
          }
     });
     const handleSubmit = (values: z.infer<typeof ResetSchema>) => {
          setError("");
          setSuccess("");
          startTransition(()=>{
               reset(values)
               .then(data=>{
                    setError(data?.error);
                    setSuccess(data?.success);
               })
          })
     }
     return (
          <CardWrapper
               headerLabel="Մոռացե՞լ եք գաղտնաբառը։"
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
                         </div>
                         <FormError message={error}/>
                         <FormSuccess message={success}/>
                         <Button type="submit" className="w-full" disabled={isPending}>{isPending ? "Խնդրում ենք սպասել..." : "Ուղարկել վերականգման հղումը"}</Button>
                    </form>
               </Form>
          </CardWrapper>
     )
}