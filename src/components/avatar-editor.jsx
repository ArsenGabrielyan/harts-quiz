import { PlayContext } from "@/pages";
import { useContext, useState } from "react";
import ReactNiceAvatar, { genConfig } from "react-nice-avatar";
import FormControl from "./formComponents/frmControl";
import { getAllStyles } from "@/lib/helpers";
import Button from "./formComponents/button";

export default function AvatarEditor({handleLeave}){
     const {formData, setFormData, currId, socket} = useContext(PlayContext);
     const [avatar, setAvatar] = useState(formData.avatar);
     const changeAvatarStyle = (type) => {
          let style = ''
          switch(type){
               case 'hairStyle': style = avatar.hairStyle==='normal' ? 'thick' : avatar.hairStyle==='thick' ? 'mohawk' : avatar.hairStyle==='mohawk' ? 'womanLong' : avatar.hairStyle==='womanLong' ? 'womanShort' : 'normal'; break;
               case 'faceColor': style = avatar.faceColor==='#F9C9B6' ? '#AC6651' : '#F9C9B6'; break;
               case "sex": style = avatar.sex==='man' ? 'woman' : 'man'; break;
               case 'earSize': style = avatar.earSize==='small' ? 'big' : 'small'; break;
               case "hatStyle": style = avatar.hatStyle==='none' ? 'beanie' : avatar.hatStyle==='beanie' ? 'turban' : 'none'; break;
               case "eyeStyle": style = avatar.eyeStyle==='circle' ? 'oval' : avatar.eyeStyle==='oval' ? 'smile' : 'circle'; break;
               case "glassesStyle": style = avatar.glassesStyle==='none' ? 'round' : avatar.glassesStyle==='round' ? 'square' : 'none'; break;
               case "noseStyle": style = avatar.noseStyle === 'short' ? 'long' : avatar.noseStyle === 'long' ? 'round' : 'short'; break;
               case "mouthStyle": style = avatar.mouthStyle === 'laugh' ? 'smile' : avatar.mouthStyle === 'smile' ? 'peace' : 'laugh'; break;
               case "shirtStyle": style = avatar.shirtStyle === 'hoody' ? 'short' : avatar.shirtStyle === 'short' ? 'polo' : 'hoody'; break;
          }
          const newAvatar = genConfig({...avatar,[type]:style})
          socket.current?.emit('change avatar',newAvatar,currId,formData.quizId)
          setAvatar(newAvatar)
          setFormData({...formData,avatar})
     }
     const changeAvatar = e => {
          const newAvatar = genConfig({...avatar, [e.target.name]: e.target.value})
          socket.current?.emit('change avatar',newAvatar,currId,formData.quizId)
          setAvatar(newAvatar)
          setFormData({...formData,avatar})
     }
     return <div className="avatar-editor">
          <ReactNiceAvatar className="avatar" {...avatar}/>
          <h2 className="my">Ձևեր</h2>
          <div className="buttons">
               {getAllStyles(avatar.sex).map((style,i)=><Button key={i} onClick={()=>changeAvatarStyle(style.name)} btnStyle="icon-blue">{style.icon}</Button>)}
          </div>
          <h2 className="my">Գույններ</h2>
          <form className="form-container">
               <div className="inner-width">
                    <FormControl type='color' onChange={changeAvatar} name='hairColor' value={avatar.hairColor} title='Մազի Գույն'/>
                    <FormControl type='color' onChange={changeAvatar} name='hatColor' value={avatar.hatColor} title='Գլխարկի Գույն'/>
                    <FormControl type='color' onChange={changeAvatar} name='shirtColor' value={avatar.shirtColor} title='Հագուստի Գույն'/>
                    <FormControl type='color' onChange={changeAvatar} name='bgColor' value={avatar.bgColor} title='Ետնաշերտ'/>
               </div>
          </form>
          <Button btnStyle="outline-white mt" onClick={handleLeave}>Լքել</Button>
     </div>
}