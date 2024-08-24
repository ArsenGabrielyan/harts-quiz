import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { GET_INITIAL_SIGNUP2, GET_MULTISTEP_DATA, validateWelcomePage } from "@/lib/formData";
import useMultiStep from "@/lib/tools/use-multistep";
import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import connectDB from "@/lib/tools/connectDb";
import User from "@/model/User";
import Button from "@/components/formComponents/button";

export default function WelcomePage(){
     const {data} = useSession(), router = useRouter();
     const [formData, setFormData] = useState(GET_INITIAL_SIGNUP2(data?.user.id));
     const [msg, setMsg] = useState({success: false, msg: ''});
     const updateFields = fields => setFormData({...formData, ...fields}); // eslint-disable-next-line
     const multiStepData = useMemo(()=>GET_MULTISTEP_DATA(formData,updateFields,formData.accountType),[formData]) 
     const multiStep = useMultiStep(multiStepData);
     const [isLoading, setIsLoading] = useState(false);
     const handleSubmit = async e => {
          e.preventDefault();
          let msg = validateWelcomePage(formData,multiStep.current);
          try{
               if(msg===''){
                    if(multiStep.isLast){
                         setIsLoading(true)
                         const res = await axios.put("/api/signup",{formData,email: data?.user?.email});
                         if(res.status===200) {
                              router.push("/feed")
                              setMsg({success: false, msg: ''});
                              setIsLoading(false);
                         }
                    } else {
                         multiStep.next()
                         setMsg({success: false, msg: ''})
                    }
               } else {
                    setMsg({success: false, msg})
               }
          } catch(err){
               setMsg({success: false, msg: err.response ? err.response.data.message : err.message});
               setIsLoading(false)
          }
     }
     useEffect(()=>{
          setFormData(GET_INITIAL_SIGNUP2(data?.user.id))
     },[data])
     return <div className="main-container">
     <form className="form-container authForm" onSubmit={handleSubmit}>
          <Link href="/feed"><Image src="/logos/logo-white.svg" alt="harts" width={200} height={100} priority/></Link>
          <p className="formTxt">Բարի Գալուստ</p>
          {msg.msg!=='' && <div className={`msg ${msg.success ? 'success' : ''}`.trim()}>{msg.msg}</div>}
          <div className="inner-width">
               {multiStep.step}
               <div className="controlBtns">
                    <Button btnStyle="outline-blue full-width" disabled={multiStep.isFirst} onClick={multiStep.prev}>Նախորդը</Button>
                    <Button type="submit" btnStyle="outline-blue full-width" disabled={isLoading}>{isLoading ? 'Բեռնվում է...' : multiStep.isLast ? 'Վերջացնել' : "Հաջորդը"}</Button>
               </div>
          </div>
     </form>
     </div>
}
export const getServerSideProps = async ctx => {
     await connectDB();
     const session = await getSession(ctx)
     const user = await User.findOne({email: session?.user?.email});
     if(user && !user.isAccountNew) return {
          redirect: {
               destination: '/feed',
               permanent: false,
          },
     }
     if(!user) return {
          redirect: {
               destination: '/feed',
               permanent: false,
          },
     }
     if(session?.user?.isOauth) return {
          redirect: {
               destination: '/welcome/oauth',
               permanent: false,
          },
     }
     return {props: {}}
}