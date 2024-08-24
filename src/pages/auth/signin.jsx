import Image from "next/image";
import Link from "next/link";
import FormControl from "@/components/formComponents/frmControl";
import { useState } from "react";
import { INITIAL_LOGINDATA, validateLogin } from "@/lib/formData";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react"
import Button from "@/components/formComponents/button";

export default function SignInPage(){
     const [loginData, setLoginData] = useState(INITIAL_LOGINDATA);
     const [msg, setMsg] = useState({success: false, msg: ''});
     const [isLoading, setIsLoading] = useState(false)
     const router = useRouter(), {status} = useSession();
     const callbackUrl = router.query.callbackUrl || "/feed";
     const handleChange = e => setLoginData({...loginData, [e.target.name]: e.target.value});
     const handleSubmit = async e => {
          e.preventDefault();
          try{
               const msg = validateLogin(loginData);
               if(msg===''){
                    setIsLoading(true);
                    const res = await signIn('credentials',{
                         redirect: false,
                         email: loginData.email,
                         password: loginData.password,
                         callbackUrl,
                    })
                    if(!res?.error){
                         router.push(callbackUrl);
                         reset()
                    } else {
                         setMsg({success: false, msg: res?.error});
                         setIsLoading(false)
                    }
               } else {
                    setMsg({success: false, msg});
               }
          } catch(err){
               setMsg({success: false, msg: err.response ? err.response.data.message : err.message});
               setIsLoading(false)
          }
     }
     const reset = () => {
          setLoginData(INITIAL_LOGINDATA);
          setMsg({success: false, msg: ''})
          setIsLoading(false);
     }
     if(status==='authenticated') router.push(callbackUrl)
     return <div className="main-container">
          <form className="form-container authForm" onSubmit={handleSubmit}>
               <Link href="/feed"><Image src="/logos/logo-white.svg" alt="harts" width={200} height={100} priority/></Link>
               <p className="formTxt">Բարի Վերադարձ</p>
               {msg.msg!=='' && <div className={`msg ${msg.success ? 'success' : ''}`.trim()}>{msg.msg}</div>}
               <div className="inner-width">
                    <FormControl name='email' title='Էլ․ փոստի հասցե' placeholder="օր․՝ name@example.com" value={loginData.email} onChange={handleChange}/>
                    <FormControl type='password' name='password' title='Գաղտնաբառ' value={loginData.password} onChange={handleChange}/>
                    <Button type="submit" btnStyle="outline-blue full-width" disabled={isLoading}>{isLoading ? "Բեռնվում է" : "Մուտք Գործել"}</Button>
                    <Link className="formLink" href="/auth/reset-password">Մոռացել եմ Գաղտնաբառս</Link>
                    <p className="txtSplit"><span>կամ</span></p>
                    <div className="oauth">
                         <Button btnStyle="outline-blue full-width" onClick={()=>signIn('facebook')}><FaFacebook/> Շարունակել Facebook-ով</Button>
                         <Button btnStyle="outline-blue full-width" onClick={()=>signIn('google')}><FaGoogle/> Շարունակել Google-ով</Button>
                    </div>
               </div>
          </form>
          <p className="info">Դուք նորե՞կ եք այստեղ։ <Link href="/auth/signup">Գրանցվել</Link></p>
     </div>
}