import Image from "next/image";
import Link from "next/link";
import ReactNiceAvatar from "react-nice-avatar";
import { signOut } from "next-auth/react";
import { accTypeInArmenian, fetcher } from "@/lib/helpers";
import { FaCog, FaQuestionCircle, FaUser } from "react-icons/fa";
import { MdAddBox, MdClose, MdDashboard, MdLibraryBooks, MdLogout, MdMenu } from "react-icons/md";
import { useState } from "react";
import Button, {BtnLink} from "./formComponents/button";
import useSWR from "swr";

const ProfilePic = ({size=64,handleClick,image}) => typeof image==='string' ? <Image src={image} alt="pfp" width={size} height={size} className="profile-pic" style={{objectFit: 'cover'}} onClick={handleClick}/> : <ReactNiceAvatar {...image} className="profile-pic" onClick={handleClick}/>

export default function HeaderUserSection({session, enableBtn}){
     const [menuOpened, setMenuOpened] = useState(false);
     const {data,isLoading} = useSWR(`/api/users?email=${session?.user?.email}`,fetcher)
     return <div className="profile">
          {enableBtn && <>{(session?.user?.accountType==='teacher' || session?.user?.accountType==='personal') && <BtnLink btnStyle="outline-blue icon" href="/quizEditor"><MdAddBox />Ստեղծել</BtnLink>}</>}
          {!isLoading && <ProfilePic image={data?.image}/>}
          <Button customClass='menuIcon' onClick={()=>setMenuOpened(!menuOpened)}>{menuOpened ? <MdClose /> : <MdMenu />}</Button>
          {menuOpened && <div className="menu">
               <div className="menu-profile">
                    {!isLoading && <ProfilePic image={data?.image} size={72}/>}
                    <div className="profile-info">
                         <h2>{data?.name}</h2>
                         <p className="type">{accTypeInArmenian(session?.user?.accountType)}</p>
                    </div>
               </div>
               <ul className="links">
                    <li><FaUser /><Link href={`/feed/users/${data?.userId}`}>Իմ Պրոֆիլը</Link></li>
                    <li><FaCog /><Link href="/settings">Կարգավորումներ</Link></li>
                    {session?.user?.accountType!=='student' && <li><MdLibraryBooks /><Link href="/library">Բոլոր Հարցաշարերը</Link></li>}
                    <li><FaQuestionCircle /><Link href="#">Օգնության կետ</Link></li>
                    <li className="red"><MdLogout /><Link href="#" onClick={async()=>await signOut()}>Դուրս Գալ</Link></li>
               </ul>
          </div>}
     </div>
}