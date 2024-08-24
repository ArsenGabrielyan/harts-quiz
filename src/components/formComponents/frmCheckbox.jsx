export default function FormCheckbox({name,value,onChange,type,children,multiple,checked}){
     return <div className="checkBox">
          <input type={type} name={name} value={value} id={value} onChange={onChange} multiple={multiple} checked={checked}/>
          <label htmlFor={value}>{children}</label>
     </div>
}