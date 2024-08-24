export default function FormSelection({name,value,onChange,children,title,readOnly, disabled=false}){
     return <div className={`frmControl ${disabled ? 'disabled' : ''}`.trim()}>
          <label htmlFor={name}>{title}</label>
          <select name={name} id={name} value={value} onChange={onChange} readOnly={readOnly}>
               {children}
          </select>
     </div>
}