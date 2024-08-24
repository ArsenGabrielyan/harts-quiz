import { useRef, useState } from "react"
import Button from "./button";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import zxcvbn from "zxcvbn";

function PassStrengthMeter({value}){
     const {score} = zxcvbn(value);
     const passStrengthData = () => {
          switch(score){
               case 0: return {color: "#a0a0a0", text: 'Շատ Թույլ է'}
               case 1: return {color: "#dc3545", text: 'Թույլ է'};
               case 2: return {color: "#ffad00", text: 'Ոչինչ'};
               case 3: return {color: "#769246", text: 'Լավ է'};
               case 4: return {color: "#167051", text: 'Վստահելի է'};
               default: return {color: 'none', text: ''}
          }
     }
     return <>
     <div className="passStrengthChecker">
          <div className="bar" style={{background: passStrengthData().color, width: `${score*25}%`}}/>
     </div>
     <p className="passStrengthTxt" style={{color: passStrengthData().color}}>{passStrengthData().text}</p>
     </>
}

export default function FormControl({name,value,onChange,type="text",title,placeholder,readOnly,ref,min,max,enablePassStrength=false,disabled=false}){
     const inputRef = useRef(null);
     const [fieldType, setFieldType] = useState(type);
     return <div className={`frmControl ${disabled ? 'disabled' : ''} ${(enablePassStrength && value!=='') ? 'passStrengthField' : ''}`.trim()}>
          <label htmlFor={name}>{title}</label>
          {type==='textarea' ? <textarea name={name} id={name} value={value} onChange={onChange} ref={ref ||inputRef} placeholder={placeholder} readOnly={readOnly} rows={3}/> : <input type={fieldType} name={name} id={name} value={value} onChange={onChange} ref={ref || inputRef} placeholder={placeholder} readOnly={readOnly} min={min} max={max}/>}
          {type==='password' && <>
               {(enablePassStrength && value!=='') && <PassStrengthMeter value={value} />}
               <Button customClass="passShowBtn" onClick={()=>setFieldType(prev=>prev==='password' ? 'text' : 'password')}>{fieldType==='password' ? <MdVisibility /> : <MdVisibilityOff />}</Button>
          </>}
          {type==='color' && <div className="color-selector" style={{background: value}} onClick={()=>inputRef.current.click()}></div>}
     </div>
}