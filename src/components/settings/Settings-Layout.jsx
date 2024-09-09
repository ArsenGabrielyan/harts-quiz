import Button from "@/components/formComponents/button";
import Image from "next/image";
import ReactNiceAvatar from "react-nice-avatar";
import Link from "next/link";
import { FaCog, FaLock} from "react-icons/fa";
import { accTypeInArmenian } from "@/lib/helpers";

export default function SettingsLayout({children,isLoading,cancelDisabled,submitDisabled,submitTxt,currUser}){
     return <>
          <h1>Կարգավորումներ</h1>
          {isLoading ? <h2>Բեռնվում է․․․</h2> : <>
          <div className="inner-width">
               <div className="profile-info">
                    {typeof currUser?.image==='object' ? <ReactNiceAvatar {...currUser?.image} className="pfp"/> : currUser?.image && <Image className="pfp" src={currUser?.image} alt="pfp" width={200} height={200} style={{objectFit: "cover"}}/>}
                    <h3>{currUser?.name} (@{currUser?.username})</h3>
                    <p>{accTypeInArmenian(currUser?.accountType)}</p>
                    {!currUser?.isOauth && <ul className="settings-menu">
                         <li><FaCog/><Link href="/settings">Կարգավորումներ</Link></li>
                         <li><FaLock /><Link href="/settings/change-password">Փոխել Գաղտնաբառը</Link></li>
                    </ul>}
               </div>
               {children}
          </div>
          <div className="setting-btns">
               <Button btnStyle="outline-blue" type="reset" disabled={cancelDisabled}>Չեղարկել</Button>
               <Button btnStyle="blue" type="submit" disabled={submitDisabled}>{submitTxt}</Button>
          </div>
          </>}
     </>
}