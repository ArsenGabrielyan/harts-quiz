import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { INITIAL_SIGNUP3, validateWelcomeOauth } from "@/lib/formData";
import axios from "axios";
import FormControl from "@/components/formComponents/frmControl";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import connectDB from "@/lib/tools/connectDb";
import User from "@/model/User";
import Button from "@/components/formComponents/button";
import FormSelection from "@/components/formComponents/frmSelect";
import { subjectList } from "@/lib/constants";
import { getFilteredSubjects } from "@/lib/helpers";
import FeedLayout from "@/components/feed/FeedLayout";

export default function WelcomePageOauth(){
     const [formData, setFormData] = useState(INITIAL_SIGNUP3);
     const [msg, setMsg] = useState({success: false, msg: ''});
     const [isLoading, setIsLoading] = useState(false);
     const {data} = useSession(), router = useRouter();
     const handleChange = e => setFormData({...formData, [e.target.name]: e.target.value});
     const handleSubmit = async e => {
          e.preventDefault();
          let msg = validateWelcomeOauth(formData);
          try{
               if(msg===''){
                    setIsLoading(true);
                    const res = await axios.put("/api/oauth",{formData, email: data?.user.email});
                    if(res.status===200){
                         router.push("/feed")
                         setMsg({success: false, msg: ''});
                         setIsLoading(false);
                    }
               } else setMsg({success: false, msg})
          } catch(err){
               setMsg({success: false, msg: err.response ? err.response.data.message : err.message});
               setIsLoading(false)
          }
     }
     return <FeedLayout type="main">
          <form className="form-container authForm" onSubmit={handleSubmit}>
               <Link href="/feed"><Image src="/logos/logo-white.svg" alt="harts" width={200} height={100} priority/></Link>
               <p className="formTxt">Բարի Գալուստ</p>
               {msg.msg!=='' && <div className={`msg ${msg.success ? 'success' : ''}`.trim()}>{msg.msg}</div>}
               <div className="inner-width">
                    <FormControl type='date' name="bdate" title="Ծննդյան Ամսաթիվ" value={formData.bdate} onChange={handleChange}/>
                    <FormControl name="organization" title="Կազմակերպություն" value={formData.organization} onChange={handleChange}/>
                    <FormSelection name="favoriteSubject" title="Ձեր սիրած առարկան" value={formData.favoriteSubject} onChange={handleChange}>
                    <option value="" disabled>Ընտրել Առարկան</option>
                    {getFilteredSubjects(subjectList)?.map((val,i)=><optgroup key={i} label={val.title}>
                         {val.data.map((val,i)=><option key={i} value={val.name}>{val.title}</option>)}
                    </optgroup>)}
               </FormSelection>
               <Button type="submit" btnStyle="outline-blue full-width" disabled={isLoading}>{isLoading ? 'Բեռնվում է...' : 'Վերջացնել'}</Button>
          </div>
          </form>
     </FeedLayout>
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
     return {props: {}}
}