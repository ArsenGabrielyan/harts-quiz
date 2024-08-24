import Link from "next/link";
import Image from "next/image";
import FormControl from "@/components/formComponents/frmControl";
import { useState } from "react";
import axios from "axios";
import Button from "@/components/formComponents/button";
import { validateEmail } from "@/lib/formData";

export default function ResetPassword(){
     const [email, setEmail] = useState('')
     const [msg, setMsg] = useState({success: false, msg: ''});
     const [isLoading, setIsLoading] = useState(false);
     const handleSubmit = async e => {
          e.preventDefault();
          try{
               const msg = validateEmail(email);
               if(msg===''){
                    setIsLoading(true);
                    const res = await axios.post("/api/pass-reset",{email})
                    if(res.status===200){
                         setMsg({success: true, msg: res.data.message});
                         setIsLoading(false);
                    }
               } else {
                    setMsg({success: false, msg})
               }
          } catch(err){
               setMsg({success: false, msg: err.response ? err.response.data.message : err.message});
               setIsLoading(false);
          }
     }
     return <div className="main-container">
          <form className="form-container authForm" onSubmit={handleSubmit}>
               <Link href="/feed"><Image src="/logos/logo-white.svg" alt="harts" width={200} height={100} priority/></Link>
               <p className="formTxt">Գաղտնաբառի վերականգնում</p>
               {msg.msg!=='' && <div className={`msg ${msg.success ? 'success' : ''}`.trim()}>{msg.msg}</div>}
               <div className="inner-width">
                    <FormControl name='email' title='Էլ․ փոստի հասցե' placeholder="օր․՝ name@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
                    <Button type="submit" btnStyle="outline-blue full-width mt" disabled={isLoading}>{isLoading ? "Բեռնվում է" : "Ուղարկել հղում"}</Button>
               </div>
          </form>
          <p className="info">Շփոթվե՞լ եք։ <Link href="/auth/signin">Մուտք գործել</Link></p>
     </div>
}