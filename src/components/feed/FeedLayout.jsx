import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import HeaderUserSection from "../UserSectionHeader";
import { MdClose, MdSearch } from "react-icons/md";
import Button, { BtnLink } from "../formComponents/button";

export default function FeedLayout({children, search, setSearch, enableCreateBtn=true, isAuth=true}){
     const {data, status} = useSession();
     const [openedSearch, setOpenedSearch] = useState(false);
     return <main className={`feed ${!isAuth ? 'no-auth' : ''}`.trim()}>
     <header>
          <div className="logoSection">
               <Link href="/feed" title="Վերադառնալ" className="logo" aria-label="Հարց"></Link>
               {(search || setSearch) && <Button customClass="menuIcon" onClick={()=>setOpenedSearch(!openedSearch)}>{openedSearch ? <MdClose /> : <MdSearch />}</Button>}
          </div>
          {openedSearch ? <>
          {(search || setSearch) && <form className="search">
               <input type="text" name="search" placeholder="Որոնում․․․" value={search} onChange={e=>setSearch(e.target.value)}/>
               {search.length!==0 && <Button customClass="formIcon" onClick={()=>setSearch('')}><MdClose /></Button>}
          </form>}
          </> : <>
          {status==='authenticated' ? <HeaderUserSection enableBtn={enableCreateBtn} session={data}/> : <BtnLink btnStyle="outline-blue" href="/auth/signin">Մուտք գործել</BtnLink>}
          </>}
     </header>
     {children}
     </main>
}