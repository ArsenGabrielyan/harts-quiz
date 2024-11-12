import FeedLayout from "@/components/feed/FeedLayout";
import Button from "@/components/formComponents/button";
import FormControl from "@/components/formComponents/frmControl";
import SettingsAvatar from "@/components/settings/avatar-editor";
import { INITIAL_SETTINGS, subjectList } from "@/lib/constants";
import { validateSettings } from "@/lib/formData";
import { fetcher, imageToBase64, getFilteredSubjects, checkIfFileExists } from "@/lib/helpers";
import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { storage } from "@/lib/tools/firebase";
import SettingsLayout from "@/components/settings/Settings-Layout";
import FormSelection from "@/components/formComponents/frmSelect";
import ToggleSwitch from "@/components/formComponents/toggle-switch";
import useTheme from "next-theme";

export default function AppSettings({session}){
     const {data: currUser, isLoading, mutate: updateUser} = useSWR(`/api/users?email=${session?.user?.email}`,fetcher);
     const [formData, setFormData] = useState(INITIAL_SETTINGS);
     const [isPending, startTransition] = useTransition();
     const [currPfp, setCurrPfp] = useState(null);
     const [isDarkMode, setIsDarkMode] = useState(false);
     const imgRef = useRef(null)
     const {update} = useSession();
     const {theme, setTheme} = useTheme();
     useEffect(()=>{
          if(!isLoading) setFormData(currUser)
     },[isLoading,currUser])
     const handleChangeImage = async e => {
          if(e.target.files[0]){
               setCurrPfp(e.target.files[0]);
               setFormData({...formData, image: await imageToBase64(e.target.files[0])})
          }
     }
     const handleChangeTheme = e => {
          setIsDarkMode(e.target.checked)
          setTheme(e.target.checked ? 'dark' : 'light')
     }
     const handleRemoveImage = () => setFormData({...formData, image: "/default-pfp.png"})
     const handleChange = e => setFormData({...formData, [e.target.name]: e.target.value});
     const handleChecked = e => setFormData({...formData, [e.target.name]: e.target.checked});
     const changeSettings = async(obj=formData)=>{
          try{
               const res = await axios.put("/api/users",{formData: obj, email: currUser?.email});
               if(res.status===200){
                    update();
                    await updateUser();
                    setCurrPfp(null)
                    toast.success(res.data.msg)
               }
          } catch(err){
               const errMsg = err.response ? err.response.data.msg : err.message;
               toast.error(errMsg);
          }
     }
     const handleSubmit = e => {
          e.preventDefault();
          const msg = validateSettings(formData,currUser?.accountType);
          if(msg===''){
               startTransition(async()=>{
                    try{
                         if(typeof formData.image === 'object'){
                              changeSettings()
                         } else if(formData.image.startsWith("data:")){
                              const pfpRef = ref(storage,`pfps/${currUser.userId}`);
                              await uploadBytes(pfpRef,currPfp);
                              const url = await getDownloadURL(pfpRef);
                              const updated = {...formData, image: url}
                              changeSettings(updated)
                         } else {
                              changeSettings()
                         }
                    } catch(err){
                         const errMsg = err.response ? err.response.data.msg : err.message;
                         toast.error(errMsg);
                    }
               })
          } else toast.error(msg)
     }
     const deleteAccount = () => {
          startTransition(async()=>{
               if(confirm('Ձեր հաշիվը ջնջելը մշտական է և հնարավոր չէ հետարկել: Իսկապե՞ս ուզում եք ջնջել ձեր հաշիվը:')){
                    try{
                         const hasPfp = await checkIfFileExists(`pfps/${currUser?.userId}`);
                         if(hasPfp){
                              const pfpRef = ref(storage,`pfps/${currUser?.userId}`);
                              await deleteObject(pfpRef);
                         }
                         const res = await axios.delete(`/api/users?id=${currUser?.userId}`)
                         if(res.status===200) await signOut();
                    } catch(err){
                         const errMsg = err.response ? err.response.data.msg : err.message;
                         toast.error(errMsg);
                    }
               }
          })
     }
     const isChanged = useMemo(()=>JSON.stringify(formData)===JSON.stringify(currUser),[currUser,formData]);
     useEffect(()=>{
          if(theme && theme==="dark") setIsDarkMode(theme==="dark");
          return () => {
               setIsDarkMode(false);
          }
     },[theme])
     return <FeedLayout>
          <form className="form-container settings authForm" onReset={()=>setFormData(!currUser ? INITIAL_SETTINGS : currUser)} onSubmit={handleSubmit}>
               <SettingsLayout isLoading={isLoading} currUser={currUser} cancelDisabled={isChanged} submitDisabled={isChanged || isPending} submitTxt={isPending ? 'Բեռնվում է․․․' : 'Պահպանել'}>
                    <div className="settings">
                         <h2>Խմբագրել հաշիվը</h2>
                         <FormControl name="name" value={formData?.name} onChange={handleChange} title="Հաշվի անուն"/>
                         <FormControl name="username" value={formData?.username} onChange={handleChange} title="Օգտանուն"/>
                         {!currUser?.isOauth && <FormControl name="email" value={formData?.email} onChange={handleChange} title="Էլ․ փոստի հասցե"/>}
                         <FormControl name="organization" value={formData?.organization} onChange={handleChange} title="Կազմակերպության անուն"/>
                         <FormControl type="textarea" name="bio" value={formData?.bio} onChange={handleChange} title="Հաշվի Նկարագրություն"/>
                         <FormSelection name="favoriteSubject" value={formData?.favoriteSubject} onChange={handleChange} title="Ձեր սիրած առարկան" disabled={!formData?.showFavoriteSubject}>
                              <option value="" disabled>Ընտրել Առարկան</option>
                              {getFilteredSubjects(subjectList)?.map((val,i)=><optgroup key={i} label={val.title}>
                                   {val.data.map((val,i)=><option key={i} value={val.name}>{val.title}</option>)}
                              </optgroup>)}
                         </FormSelection>
                         <p className="label">Նկար</p>
                         {typeof formData?.image==='object' ? <SettingsAvatar formData={formData} setFormData={setFormData} currUser={currUser}/> : <div className="pfp-change">
                              {formData?.image && <Image src={formData?.image} alt="pfp" width={150} height={150} />}
                              <div className="info">
                                   <p>Խորհուրդ ենք տալիս ընտրել քառակուսի նկար հաշվի համար։ Նկարը պետք է հետևի մեր կարգ ու կանոնի</p>
                                   <div className="btns">
                                        <Button btnStyle="blue" onClick={()=>imgRef.current.click()}>Փոխել նկարը</Button>
                                        <Button btnStyle="outline-blue" onClick={handleRemoveImage}>Հեռացնել նկարը</Button>
                                   </div>
                              </div>
                              <input type="file" name="image" onChange={handleChangeImage} ref={imgRef}/>
                         </div>}
                         <h2>հավելվածի Կարգավորումներ</h2>
                         <ToggleSwitch name="soundEffectOn" checked={formData?.soundEffectOn} onChange={handleChecked} title="Ձայնային էֆֆեկտներ"/>
                         <ToggleSwitch name="showFavoriteSubject" checked={formData?.showFavoriteSubject} onChange={handleChecked} title="Ցույց տալ սիրած առարկան" />
                         <ToggleSwitch name="darkMode" checked={isDarkMode} onChange={handleChangeTheme} title="Մութ Ռեժիմ"/>
                         <h2>Ջնջել հաշիվը</h2>
                         <p>Եթե ջնջում ես այս հաշիվը, ձեր բոլոր տվյալները նույնիսկ կջնջվեն և հետդարձ չկա</p>
                         <Button onClick={deleteAccount} btnStyle="outline-red mt">Ջնջել Հաշիվը</Button>
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