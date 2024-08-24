export default function ToggleSwitch({title,onChange,name,checked=false}){
     return <div className="switch-container">
          <p className="label">{title}</p>
          <div className="frmSwitch">
               <input type="checkbox" onChange={onChange} name={name} id={name} checked={checked}/>
               <label htmlFor={name}>
                    <span className="slider"></span>
               </label>
          </div>
     </div>
}