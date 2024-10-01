import Image from "next/image";
import Link from "next/link";
import FormControl from "@/components/formComponents/frmControl";
import { useState } from "react";
import { INITIAL_SIGNUPDATA, validateSignup } from "@/lib/formData";
import axios from "axios";
import { getSession } from "next-auth/react";
import Button from "@/components/formComponents/button";
import FeedLayout from "@/components/feed/FeedLayout";

export default function SignUp(){
     const [signupData, setSignupData] = useState(INITIAL_SIGNUPDATA)
     const [msg, setMsg] = useState({success: false, msg: ''});
     const [isLoading, setIsLoading] = useState(false);
     const reset = () => {
          setSignupData(INITIAL_SIGNUPDATA);
          setIsLoading(false);
     }
     const handleChange = e => setSignupData({...signupData, [e.target.name]: e.target.value});
     const handleSubmit = async e => {
          e.preventDefault();
          try{
               const msg = validateSignup(signupData);
               if(msg===''){
                    setIsLoading(true);
                    const res = await axios.post("/api/signup",{signupData});
                    if(res.status===200){
                         setMsg({success: true, msg: res.data.message});
                         reset();
                    }
               } else {
                    setMsg({success: false, msg});
               }
          } catch(err){
               setMsg({success: false, msg: err.response ? err.response.data.message : err.message});
               setIsLoading(false);
          }
     }
     return <FeedLayout type="main">
          <form className="form-container authForm" onSubmit={handleSubmit}>
               <Link href="/feed"><Image src="/logos/logo-white.svg" alt="harts" width={200} height={100} priority/></Link>
               <p className="formTxt">Ստեղծել հաշիվ</p>
               {msg.msg!=='' && <div className={`msg ${msg.success ? 'success' : ''}`.trim()}>{msg.msg}</div>}
               <div className="inner-width">
                    <FormControl name='name' title='Անուն' placeholder="օր․՝ Պողոս Կիրակոսյան" value={signupData.name} onChange={handleChange}/>
                    <FormControl name='email' title='Էլ․ փոստի հասցե' placeholder="օր․՝ name@example.com" value={signupData.email} onChange={handleChange}/>
                    <FormControl type="date" name="bdate" title="Ծննդյան օր" value={signupData.bdate} onChange={handleChange}/>
                    <FormControl type='password' name='password' title='Գաղտնաբառ' value={signupData.password} onChange={handleChange} enablePassStrength/>
                    <FormControl type='password' name='passConfirm' title='Կրկնել գաղտնաբառը' value={signupData.passConfirm} onChange={handleChange}/>
                    <div className="frmCheck">
                         <input type="checkbox" checked={signupData.agreed} onChange={e=>setSignupData({...signupData, agreed: e.target.checked})} name="agreed" id="agreed"/>
                         <label htmlFor="agreed">Ես համաձայն եմ այս կանոների հետ</label>
                    </div>
                    <Button type="submit" btnStyle="outline-blue full-width" disabled={isLoading}>{isLoading ? "Բեռնվում է" : "Գրանցվել"}</Button>
               </div>
          </form>
          <p className="info">Արդեն ունե՞ք հաշիվ։ <Link href="/auth/signin">Մուտք գործել</Link></p>
     </FeedLayout>
}
export const getServerSideProps = async ctx => {
     const session = await getSession(ctx);
     const {callbackUrl} = ctx.query;
     if(session) return {redirect: {
          destination: callbackUrl || "/feed",
          permanent: false,
     }}
     return {props: {}}
}