"use client"
import { useState, useTransition } from "react";
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { RegisterSchema } from "@/lib/schemas";
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
import { register } from "@/actions/auth/register";
import { PasswordStrengthInput } from "../password-input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { ENUM_ACCOUNT_TYPES } from "@/lib/constants/others";
import { RegisterType } from "@/lib/types/schema";

export default function RegisterForm(){
     const [isPending, startTransition] = useTransition();
     const [error, setError] = useState<string | undefined>("");
     const [success, setSuccess] = useState<string | undefined>("");
     const form = useForm<RegisterType>({
          resolver: zodResolver(RegisterSchema),
          defaultValues: {
               name: "",
               email: "",
               username: "",
               password: "",
               accountType: "student",
          }
     });
     const handleSubmit = (values: RegisterType) => {
          setError("");
          setSuccess("");
          startTransition(()=>{
               register(values)
               .then(data=>{
                    setError(data.error);
                    setSuccess(data.success);
               })
          })
     }
     return (
          <CardWrapper
               headerLabel="Ստեղծել հաշիվ"
               backButtonLabel="Արդեն ունե՞ք հաշիվ։"
               backButtonHref="/auth/login"
               showSocial
          >
               <Form {...form}>
                    <form
                         onSubmit={form.handleSubmit(handleSubmit)}
                         className="space-y-6"
                    >
                         <div className="space-y-4">
                              <FormField
                                   control={form.control}
                                   name="name"
                                   render={({field})=>(
                                        <FormItem>
                                             <FormLabel>Անուն Ազգանուն</FormLabel>
                                             <FormControl>
                                                  <Input
                                                       {...field}
                                                       disabled={isPending}
                                                       placeholder="Պողոս Պետրոսյան"
                                                  />
                                             </FormControl>
                                             <FormMessage/>
                                        </FormItem>
                                   )}
                              />
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
                                   name="username"
                                   render={({field})=>(
                                        <FormItem>
                                             <FormLabel>Օգտանուն</FormLabel>
                                             <FormControl>
                                                  <Input
                                                       {...field}
                                                       disabled={isPending}
                                                       placeholder="poghos1234"
                                                  />
                                             </FormControl>
                                             <FormMessage/>
                                        </FormItem>
                                   )}
                              />
                              <FormField
                                   control={form.control}
                                   name="accountType"
                                   render={({field})=>(
                                        <FormItem>
                                             <FormLabel>Հաշվի տեսակ</FormLabel>
                                             <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                                  <FormControl>
                                                       <SelectTrigger>
                                                            <SelectValue placeholder="Ընտրել հաշվի տեսակը"/>
                                                       </SelectTrigger>
                                                  </FormControl>
                                                  <SelectContent>
                                                       {ENUM_ACCOUNT_TYPES.map((accType,i)=>(
                                                            <SelectItem
                                                                 key={i}
                                                                 value={accType.type}
                                                            >
                                                                 <div className="flex item-center justify-center gap-x-3">
                                                                      <accType.Icon className="w-[20px] h-[20px]"/>
                                                                      {accType.name}
                                                                 </div>
                                                            </SelectItem>
                                                       ))}     
                                                  </SelectContent>  
                                             </Select>
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
                                                  <PasswordStrengthInput
                                                       {...field}
                                                       placeholder="********"
                                                       disabled={isPending}
                                                  />
                                             </FormControl>
                                             <FormMessage/>
                                        </FormItem>
                                   )}
                              />
                         </div>
                         <FormError message={error}/>
                         <FormSuccess message={success}/>
                         <Button type="submit" className="w-full" disabled={isPending}>{isPending ? "Խնդրում ենք սպասել..." : "Գրանցվել"}</Button>
                    </form>
               </Form>
          </CardWrapper>
     )
}