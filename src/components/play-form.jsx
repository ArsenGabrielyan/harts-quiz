import FormControl from "@/components/formComponents/frmControl";
import { generateId } from "@/lib/helpers";
import { PlayContext } from "@/pages";
import { useContext, useEffect, useState } from "react";
import ReactNiceAvatar, {genConfig} from "react-nice-avatar"
import Button from "@/components/formComponents/button";
import { validateJoinGame } from "@/lib/formData";
import ToggleSwitch from "@/components/formComponents/toggle-switch";

export default function PlayForm({onSubmit, hasId}){
     const {setSubmitted, formData, setFormData} = useContext(PlayContext)
     const [msg, setMsg] = useState('')
     const handleChange = e => setFormData({...formData,[e.target.name]: e.target.value})
     const handleCheck = e => setFormData({...formData,[e.target.name]: e.target.checked})
     const handleSubmit = (e) => {
          e.preventDefault();
          const error = validateJoinGame(formData);
          if(error===''){
               setMsg('')
               onSubmit(formData)
               setSubmitted(true);
          } else setMsg(error)
     }
     useEffect(()=>{
          setFormData(prev=>({...prev, avatar: prev.avatar===null ? genConfig() : prev.avatar}))
          //eslint-disable-next-line
     },[])
     return <form className="form-container" onSubmit={handleSubmit}>
          {msg && <div className="msg">{msg}</div>}
          <div className="inner-width">
          <FormControl name='quizId' value={formData.quizId} onChange={handleChange} title='Խաղի Կոդ' readOnly={hasId}/>
          <FormControl name='playerName' value={formData.playerName} onChange={handleChange} title='Աշակերտի Անուն'/>
          <ToggleSwitch name="soundEffectOn" onChange={handleCheck} title="Ձայնային Էֆֆեկտներ" checked={formData.soundEffectOn}/>
          {!!formData.avatar && <div className="frmControl">
               <label htmlFor="pfp">Նկար</label>
               <ReactNiceAvatar className="avatar" {...formData.avatar}/>
               <Button btnStyle="outline-blue mt" onClick={()=>setFormData({...formData,avatar:genConfig()})}>Նորից գեներացնել</Button>
          </div>}
          </div>
          <Button type="submit" btnStyle="outline-white mt">Միանալ</Button>
     </form>
}