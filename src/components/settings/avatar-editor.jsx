import Button from "@/components/formComponents/button";
import FormControl from "@/components/formComponents/frmControl";
import { getAllStyles } from "@/lib/helpers";
import ReactNiceAvatar, { genConfig } from "react-nice-avatar";

export default function SettingsAvatar({formData, setFormData, currUser}){
     const regenerate = () => {
          if(currUser?.accountType==='student'){
               const newAvatar = genConfig();
               setFormData({...formData, image: newAvatar})
          }
     }
     const changeAvatar = e => {
          if(currUser?.accountType==='student'){
               const newAvatar = genConfig({...formData?.image,[e.target.name]:e.target.value})
               setFormData({...formData, image: newAvatar})
          }
     }
     const changeAvatarStyle = (type) => {
          if(currUser?.accountType==='student'){
               let style = ''
               switch(type){
                    case 'hairStyle': style = formData?.image.hairStyle==='normal' ? 'thick' : formData?.image.hairStyle==='thick' ? 'mohawk' : formData?.image.hairStyle==='mohawk' ? 'womanLong' : formData?.image.hairStyle==='womanLong' ? 'womanShort' : 'normal'; break;
                    case 'faceColor': style = formData?.image.faceColor==='#F9C9B6' ? '#AC6651' : '#F9C9B6'; break;
                    case "sex": style = formData?.image.sex==='man' ? 'woman' : 'man'; break;
                    case 'earSize': style = formData?.image.earSize==='small' ? 'big' : 'small'; break;
                    case "hatStyle": style = formData?.image.hatStyle==='none' ? 'beanie' : formData?.image.hatStyle==='beanie' ? 'turban' : 'none'; break;
                    case "eyeStyle": style = formData?.image.eyeStyle==='circle' ? 'oval' : formData?.image.eyeStyle==='oval' ? 'smile' : 'circle'; break;
                    case "glassesStyle": style = formData?.image.glassesStyle==='none' ? 'round' : formData?.image.glassesStyle==='round' ? 'square' : 'none'; break;
                    case "noseStyle": style = formData?.image.noseStyle === 'short' ? 'long' : formData?.image.noseStyle === 'long' ? 'round' : 'short'; break;
                    case "mouthStyle": style = formData?.image.mouthStyle === 'laugh' ? 'smile' : formData?.image.mouthStyle === 'smile' ? 'peace' : 'laugh'; break;
                    case "shirtStyle": style = formData?.image.shirtStyle === 'hoody' ? 'short' : formData?.image.shirtStyle === 'short' ? 'polo' : 'hoody'; break;
               }
               const newAvatar = genConfig({...formData?.image,[type]:style})
               setFormData({...formData, image: newAvatar})
          }
     }
     return <div className="frmAvatar">
          <ReactNiceAvatar {...formData?.image} className="avatar-preview"/>
          <div className="style">
               <h2 className="my">Ձևեր</h2>
               <div className="buttons">
                    {getAllStyles(formData?.image?.sex).map((style,i)=><Button key={i} onClick={()=>changeAvatarStyle(style.name)} btnStyle="icon-blue">{style.icon}</Button>)}
                    <Button btnStyle="outline-blue full mt" onClick={regenerate}>Նորից գեներացնել</Button>
               </div>
          </div>
          <div className="color">
               <h2 className="my">Գույններ</h2>
               <div className="form-container avatarForm">
                    <div className="inner-width">
                         <FormControl type='color' onChange={changeAvatar} name='hairColor' value={formData?.image?.hairColor} title='Մազի Գույն'/>
                         <FormControl type='color' onChange={changeAvatar} name='hatColor' value={formData?.image?.hatColor} title='Գլխարկի Գույն'/>
                         <FormControl type='color' onChange={changeAvatar} name='shirtColor' value={formData?.image?.shirtColor} title='Հագուստի Գույն'/>
                         <FormControl type='color' onChange={changeAvatar} name='bgColor' value={formData?.image?.bgColor} title='Ետնաշերտ'/>
                    </div>
               </div>
          </div>
     </div>
}