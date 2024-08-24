import Link from "next/link";
import Image from "next/image";
import FormControl from "@/components/formComponents/frmControl";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import connectDB from "@/lib/tools/connectDb";
import PassResetToken from "@/model/PassResetToken";
import { useSession } from "next-auth/react";
import Button from "@/components/formComponents/button";
import { PASS_RESET_INITIAL, validatePasswords } from "@/lib/formData";

export default function PassResetForm({isLinkInvalid}){
     const [passData, setPassData] = useState(PASS_RESET_INITIAL)
     const [msg, setMsg] = useState({success: false, msg: ''});
     const [isLoading, setIsLoading] = useState(false);
     const router = useRouter();
     const {token,email} = router.query;
     const {data} = useSession()
     const handleChange = e => setPassData({...passData, [e.target.name]: e.target.value})
     const handleSubmit = async e => {
          e.preventDefault();
          try{
               const msg = validatePasswords(passData);
               if(msg===''){
                    setIsLoading(true);
                    const res = await axios.post("/api/pass-reset/recover",{token,email,newPass: passData.password})
                    if(res.status===200){
                         setMsg({success: true, msg: res.data.message});
                         setIsLoading(false);
                         setTimeout(()=>{
                              router.push(!data ? "/auth/signin" : "/feed")
                              setPassData(PASS_RESET_INITIAL)
                              setMsg({success: false, msg: ''})
                         },1500)
                    }
               } else setMsg({success: false, msg})
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
                    {isLinkInvalid ? <p className="label">Այս էջը դեռ հասանելի չէ</p> : <>
                         <FormControl type='password' name='password' title='Նոր Գաղտնաբառ' value={passData.password} onChange={handleChange} enablePassStrength/>
                         <FormControl type='password' name='passConfirm' title='Կրկնել գաղտնաբառը' value={passData.passConfirm} onChange={handleChange}/>
                         <Button type="submit" btnStyle="outline-blue full-width mt" disabled={isLoading}>{isLoading ? "Բեռնվում է" : "Վերականգնել"}</Button>
                    </>}
               </div>
          </form>
          <p className="info">{isLinkInvalid ? "Դուք կարող եք" : "Շփոթվե՞լ եք։"} <Link href="/auth/signin">Մուտք գործել</Link></p>
     </div>
}
export const getServerSideProps = async ({query}) => {
     await connectDB();
     const claimedToken = await PassResetToken.findOne({token: query.token})
     if(!claimedToken) return {props: {isLinkInvalid: true}};
     else return {props: {isLinkInvalid: false}};
}