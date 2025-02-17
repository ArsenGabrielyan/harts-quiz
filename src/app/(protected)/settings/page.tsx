"use client"
import * as z from "zod";
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsSchema } from "@/schemas";
import { useSession } from "next-auth/react";
import { useTransition, useState } from "react";
import { deleteAccount, settings } from "@/actions/settings";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import {
     Form,
     FormField,
     FormControl,
     FormItem,
     FormLabel,
     FormDescription,
     FormMessage
} from "@/components/ui/form"
import {
     Select,
     SelectContent,
     SelectGroup,
     SelectItem,
     SelectLabel,
     SelectTrigger,
     SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FormSuccess } from "@/components/form-success";
import { FormError } from "@/components/form-error";
import { accountTypesEnum } from "@/data/constants";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { getFilteredSubjects } from "@/data/helpers";
import { Label } from "@/components/ui/label";
import ThemeSettings from "@/components/themes/theme-changer";
import { logout } from "@/actions/auth/logout";

export default function SettingsPage(){
     const user = useCurrentUser();

     const [error, setError] = useState<string | undefined>();
     const [success, setSuccess] = useState<string | undefined>();
     const [isPending, startTransition] = useTransition();
     const {update} = useSession()

     const form = useForm<z.infer<typeof SettingsSchema>>({
          resolver: zodResolver(SettingsSchema),
          defaultValues: {
               password: undefined,
               newPassword: undefined,
               name: user?.name || undefined,
               email: user?.email || undefined,
               username: user?.username || undefined,
               organization: user?.organization || undefined,
               accountType: user?.accountType || undefined,
               bio: user?.bio || undefined,
               favoriteSubject: user?.favoriteSubject || undefined,
               soundEffectOn: user?.soundEffectOn || undefined,
               showFavoriteSubject: user?.showFavoriteSubject || undefined,
               isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined
          }
     })

     const handleSubmit = (values: z.infer<typeof SettingsSchema>) => {
          setError("");
          setSuccess("");
          startTransition(()=>{
               settings(values)
               .then((data)=>{
                    if(data.error){
                         setError(data.error)
                    }
                    if(data.success){
                         update();
                         setSuccess(data.success)
                    }
               })
               .catch(()=>setError("Վայ, մի բան սխալ տեղի ունեցավ"))
          })
     }
     const handleDeleteAccount = () => {
          if(confirm("Իսկապե՞ս ջնջել այս հաշիվը։ Եթե այո, ձեր բոլոր տվյալները նույնիսկ կջնջվեն և հետդարձ չկա")){
               deleteAccount(user?.email!)
               .then((data)=>{
                    if(data.error) setError(data.error);
                    if(data.success) setSuccess(data.success)
               })
               .catch(()=>setError("Վայ, մի բան սխալ տեղի ունեցավ"))
          }
     }
     return (
          <PageLayout>
               <h1 className="text-3xl md:text-4xl text-center mb-4">Կարգավորումներ</h1>
               <div className="p-4 bg-card text-foreground border shadow rounded-xl">
                    <Form {...form}>
                         <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
                              <div className="space-y-4">
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <FormField
                                             control={form.control}
                                             name="name"
                                             render={({field})=>(
                                                  <FormItem>
                                                       <FormLabel>Անուն Ազգանուն</FormLabel>
                                                       <FormControl>
                                                            <Input
                                                                 {...field}
                                                                 placeholder="Պողոս Պետրոսյան"
                                                                 disabled={isPending}
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
                                                                 placeholder="poghos1234"
                                                                 disabled={isPending}
                                                            />
                                                       </FormControl>
                                                       <FormMessage/>
                                                  </FormItem>
                                             )}
                                        />
                                   </div>
                                   {!user?.isOauth && (
                                        <FormField
                                             control={form.control}
                                             name="email"
                                             render={({field})=>(
                                                  <FormItem>
                                                       <FormLabel>Էլ․ հասցե</FormLabel>
                                                       <FormControl>
                                                            <Input
                                                                 {...field}
                                                                 placeholder="name@example.com"
                                                                 type="email"
                                                                 disabled={isPending}
                                                            />
                                                       </FormControl>
                                                       <FormMessage/>
                                                  </FormItem>
                                             )}
                                        />
                                   )}
                                   <FormField
                                        control={form.control}
                                        name="organization"
                                        render={({field})=>(
                                             <FormItem>
                                                  <FormLabel>Կազմակերպություն</FormLabel>
                                                  <FormControl>
                                                       <Input
                                                            {...field}
                                                            placeholder="Ինչ-որ կազմակերպություն ՍՊԸ"
                                                            disabled={isPending}
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
                                                            {accountTypesEnum.map((accType,i)=>(
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
                                        name="bio"
                                        render={({field})=>(
                                             <FormItem>
                                                  <FormLabel>Նկարագրություն</FormLabel>
                                                  <FormControl>
                                                       <Textarea
                                                            {...field}
                                                            placeholder="Տեղադրել Ձեր մասին տեղեկությունը այստեղ"
                                                            disabled={isPending}
                                                       />
                                                  </FormControl>
                                                  <FormMessage/>
                                             </FormItem>
                                        )}
                                   />
                                   <FormField
                                        control={form.control}
                                        name="favoriteSubject"
                                        render={({field})=>(
                                             <FormItem>
                                                  <FormLabel>Ձեր սիրած առարկան</FormLabel>
                                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                       <FormControl>
                                                            <SelectTrigger>
                                                                 <SelectValue placeholder="Ընտրել առարկան"/>
                                                            </SelectTrigger>
                                                       </FormControl>
                                                       <SelectContent>
                                                            {getFilteredSubjects().map((optgroup,i)=>(
                                                                 <SelectGroup key={i}>
                                                                      <SelectLabel>{optgroup.title}</SelectLabel>
                                                                      {optgroup.data.map((subject,i)=>(
                                                                           <SelectItem key={i} value={subject.name}>{subject.title}</SelectItem>
                                                                      ))}
                                                                 </SelectGroup>
                                                            ))}
                                                       </SelectContent>
                                                  </Select>
                                                  <FormMessage/>
                                             </FormItem>
                                        )}
                                   />
                                   <FormField
                                        control={form.control}
                                        name="soundEffectOn"
                                        render={({field})=>(
                                             <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                  <div className="space-y-0.5">
                                                       <FormLabel>Ձայնային էֆֆեկտներ</FormLabel>
                                                       <FormDescription>Ձայններ, որոնք օգտագործվում են Հարց հավելվածում հարցաշար պատասխանելիս</FormDescription>
                                                       <FormMessage/>
                                                  </div>
                                                  <FormControl>
                                                       <Switch
                                                            disabled={isPending}
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                       />
                                                  </FormControl>
                                             </FormItem>
                                        )}
                                   />
                                   <FormField
                                        control={form.control}
                                        name="showFavoriteSubject"
                                        render={({field})=>(
                                             <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                  <div className="space-y-0.5">
                                                       <FormLabel>Ցույց տալ ձեր սիրած առարկան բոլորին</FormLabel>
                                                       <FormMessage/>
                                                  </div>
                                                  <FormControl>
                                                       <Switch
                                                            disabled={isPending}
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                       />
                                                  </FormControl>
                                             </FormItem>
                                        )}
                                   />
                                   <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                             <Label>Հավելվածի դիզայնը</Label>
                                             <p className="text-[0.8rem] text-muted-foreground">Ծրագրի գույնը և ռեժիմը</p>
                                        </div>
                                        <ThemeSettings/>
                                   </div>
                                   {!user?.isOauth && (
                                        <>
                                             <h2 className="text-xl md:text-2xl font-semibold">Անվտանգություն</h2>
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
                                                                      type="password"
                                                                      disabled={isPending}
                                                                 />
                                                            </FormControl>
                                                            <FormMessage/>
                                                       </FormItem>
                                                  )}
                                             />
                                             <FormField
                                                  control={form.control}
                                                  name="newPassword"
                                                  render={({field})=>(
                                                       <FormItem>
                                                            <FormLabel>Նոր գաղտնաբառ</FormLabel>
                                                            <FormControl>
                                                                 <Input
                                                                      {...field}
                                                                      placeholder="********"
                                                                      type="password"
                                                                      disabled={isPending}
                                                                 />
                                                            </FormControl>
                                                            <FormMessage/>
                                                       </FormItem>
                                                  )}
                                             />
                                             <FormField
                                                  control={form.control}
                                                  name="isTwoFactorEnabled"
                                                  render={({field})=>(
                                                       <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                            <div className="space-y-0.5">
                                                                 <FormLabel>Երկաստիճան վավերացում</FormLabel>
                                                                 <FormDescription>Միացնել երկաստիճան վավերացումը հաշվի պաշտպանությունը ուժեղացնելու համար</FormDescription>
                                                                 <FormMessage/>
                                                            </div>
                                                            <FormControl>
                                                                 <Switch
                                                                      disabled={isPending}
                                                                      checked={field.value}
                                                                      onCheckedChange={field.onChange}
                                                                 />
                                                            </FormControl>
                                                       </FormItem>
                                                  )}
                                             />
                                        </>
                                   )}
                                   <h2 className="text-xl md:text-2xl font-semibold">Ջնջել հաշիվը</h2>
                                   <p className="text-muted-foreground">Եթե ջնջում եք այս հաշիվը, ձեր բոլոր տվյալները նույնիսկ կջնջվեն և հետդարձ չկա</p>
                                   <Button type="button" variant="destructive" onClick={handleDeleteAccount}>Ջնջել հաշիվը</Button>
                              </div>
                              <FormError message={error}/>
                              <FormSuccess message={success}/>
                              <Button type="submit" disabled={isPending}>{isPending ? "Խնդրում ենք սպասել" : 'Պահպանել'}</Button>
                         </form>
                    </Form>
               </div>
          </PageLayout>
     )
}