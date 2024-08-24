import { useState } from "react";
import ReactNiceAvatar, { genConfig } from "react-nice-avatar";
import FormControl from "../formComponents/frmControl";
import { getAllStyles } from "@/lib/helpers";
import Button from "../formComponents/button";

export default function AvatarForm({image, updateFields}){
     const [currAvatar, setCurrAvatar] = useState(typeof image!=='object' ? genConfig() : image);
     const changeAvatarStyle = (type) => {
          let style = ''
          switch(type){
               case 'hairStyle': style = currAvatar?.hairStyle==='normal' ? 'thick' : currAvatar?.hairStyle==='thick' ? 'mohawk' : currAvatar?.hairStyle==='mohawk' ? 'womanLong' : currAvatar?.hairStyle==='womanLong' ? 'womanShort' : 'normal'; break;
               case 'faceColor': style = currAvatar?.faceColor==='#F9C9B6' ? '#AC6651' : '#F9C9B6'; break;
               case "sex": style = currAvatar?.sex==='man' ? 'woman' : 'man'; break;
               case 'earSize': style = currAvatar?.earSize==='small' ? 'big' : 'small'; break;
               case "hatStyle": style = currAvatar?.hatStyle==='none' ? 'beanie' : currAvatar?.hatStyle==='beanie' ? 'turban' : 'none'; break;
               case "eyeStyle": style = currAvatar?.eyeStyle==='circle' ? 'oval' : currAvatar?.eyeStyle==='oval' ? 'smile' : 'circle'; break;
               case "glassesStyle": style = currAvatar?.glassesStyle==='none' ? 'round' : currAvatar?.glassesStyle==='round' ? 'square' : 'none'; break;
               case "noseStyle": style = currAvatar?.noseStyle === 'short' ? 'long' : currAvatar?.noseStyle === 'long' ? 'round' : 'short'; break;
               case "mouthStyle": style = currAvatar?.mouthStyle === 'laugh' ? 'smile' : currAvatar?.mouthStyle === 'smile' ? 'peace' : 'laugh'; break;
               case "shirtStyle": style = currAvatar?.shirtStyle === 'hoody' ? 'short' : currAvatar?.shirtStyle === 'short' ? 'polo' : 'hoody'; break;
          }
          const newAvatar = genConfig({...currAvatar,[type]:style})
          setCurrAvatar(newAvatar)
          updateFields({image: newAvatar});
     }
     const changeAvatar = e => {
          const newAvatar = genConfig({...currAvatar,[e.target.name]:e.target.value})
          setCurrAvatar(newAvatar)
          updateFields({image: newAvatar});
     }
     const regenerate = () => {
          const newAvatar = genConfig();
          setCurrAvatar(newAvatar);
          updateFields({image: newAvatar});
     }
     return <div className="frmAvatar">
          <h2>Նկար</h2>
          <ReactNiceAvatar className="avatar" {...currAvatar}/>
          <h2 className="my">Ձևեր</h2>
          <div className="buttons">
               {getAllStyles(currAvatar?.sex).map((style,i)=><Button key={i} onClick={()=>changeAvatarStyle(style.name)} btnStyle="icon-blue">{style.icon}</Button>)}
               <Button btnStyle="outline-blue full mt" onClick={regenerate}>Նորից գեներացնել</Button>
          </div>
          <h2 className="my">Գույններ</h2>
          <div className="form-container avatarForm">
               <div className="inner-width">
                    <FormControl type='color' onChange={changeAvatar} name='hairColor' value={currAvatar?.hairColor} title='Մազի Գույն'/>
                    <FormControl type='color' onChange={changeAvatar} name='hatColor' value={currAvatar?.hatColor} title='Գլխարկի Գույն'/>
                    <FormControl type='color' onChange={changeAvatar} name='shirtColor' value={currAvatar?.shirtColor} title='Հագուստի Գույն'/>
                    <FormControl type='color' onChange={changeAvatar} name='bgColor' value={currAvatar?.bgColor} title='Ետնաշերտ'/>
               </div>
          </div>
     </div>
}