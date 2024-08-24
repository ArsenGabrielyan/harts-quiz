import Link from "next/link"

export default function Button({children,type="button",btnStyle='',onClick, disabled, customClass='',title}){
     const className = customClass ? customClass : `btn ${btnStyle}`
     return <button type={type} title={title} className={className} onClick={onClick} disabled={disabled}>{children}</button>
}
export function BtnLink({children,href="",btnStyle="",title}){
     return <Link title={title} href={href} className={`btn ${btnStyle}`}>{children}</Link>
}