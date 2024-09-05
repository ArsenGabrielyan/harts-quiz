import FeedLayout from "@/components/feed/FeedLayout";
import FormControl from "@/components/formComponents/frmControl";
import { validatePasswords, PASS_RESET_INITIAL } from "@/lib/formData";
import { fetcher } from "@/lib/helpers";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import SettingsLayout from "@/components/settings/Settings-Layout";

export default function PasswordSettings({session}){
     const [passData, setPassData] = useState(PASS_RESET_INITIAL);
     const {data: currUser, isLoading} = useSWR(`/api/users?email=${session?.user?.email}`,fetcher);
     const [isChanging, setIsChanging] = useState(false);
     const handleChange = e => setPassData({...passData, [e.target.name]: e.target.value});
     const handleSubmit = async e => {
          e.preventDefault();
          try{
               const msg = validatePasswords(passData);
               if(msg===''){
                    setIsChanging(true)
                    const res = await axios.put("/api/users",{type: 'changePass', password: passData.password, email: currUser?.email});
                    if(res.status===200){
                         setPassData(PASS_RESET_INITIAL);
                         setIsChanging(false);
                         toast.success(res.data.msg)
                    }
               } else toast.error(msg)
          } catch(err){
               const errMsg = err.response ? err.response.data.msg : err.message;
               toast.error(errMsg);
               setIsChanging(false)
          }
     }
     return <FeedLayout>
          <form className="form-container settings authForm" onReset={()=>setPassData(PASS_RESET_INITIAL)} onSubmit={handleSubmit}>
               <SettingsLayout isLoading={isLoading} currUser={currUser} submitDisabled={isChanging} submitTxt={isChanging ? 'Բեռնվում է․․․' : 'Պահպանել'}>
                    <div className="settings">
                         <h2>Փոխել Գաղտնաբառը</h2>
                         <FormControl type='password' name='password' title='Նոր Գաղտնաբառ' value={passData.password} onChange={handleChange} enablePassStrength/>
                         <FormControl type='password' name='passConfirm' title='Կրկնել գաղտնաբառը' value={passData.passConfirm} onChange={handleChange}/>
                    </div>
               </SettingsLayout>
          </form>
     </FeedLayout>
}
export const getServerSideProps = async(ctx)=>{
     const session = await getSession(ctx);
     return session ? {props: {session}} : {redirect: {
          destination: '/auth/signin',
          permanent: false,
     }}
}