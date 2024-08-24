import FeedLayout from "@/components/feed/FeedLayout";
import Button, {BtnLink} from "@/components/formComponents/button";
import { accTypeInArmenian } from "@/lib/helpers";
import User from "@/model/User";
import { getSession } from "next-auth/react"
import Image from "next/image";
import { useState } from "react";
import ReactNiceAvatar from "react-nice-avatar";

export default function UserList({users}){
     const [usersCount, setUsersCount] = useState(20);
     const [search, setSearch] = useState("");
     return <FeedLayout search={search} setSearch={setSearch}>
          <section>
               <h1 className="title">Օգտվողներ</h1>
               <div className="users">
                    {users.filter(val=>
                         val.name.toLowerCase().includes(search.toLowerCase()) ||
                         val.username.toLowerCase().includes(search.toLowerCase())
                    ).slice(0,usersCount).map(user=><div className="user" key={user.userId}>
                         {typeof user.image==='string' ? <Image src={user.image} alt="pfp" width={150} height={150} className="pfp"/> : <ReactNiceAvatar className="pfp" {...user.image} />}
                         <h2>{user.name}</h2>
                         <p>{accTypeInArmenian(user.accountType)}</p>
                         <BtnLink href={`/feed/users/${user.userId}`} btnStyle="outline-blue">Իմանալ Ավելին</BtnLink>
                    </div>)}
               </div>
               {usersCount<=users.filter(val=>
                    val.name.toLowerCase().includes(search.toLowerCase()) ||
                    val.username.toLowerCase().includes(search.toLowerCase())
               ).length && <Button onClick={()=>setUsersCount(prev=>prev+10)} btnStyle="outline-white mt">Բեռնել Ավելին</Button>}
          </section>
     </FeedLayout>
}
export const getServerSideProps = async ctx => {
     const session = await getSession(ctx);
     const users = JSON.parse(JSON.stringify(await User.find()));
     const user = await User.findOne({email: session?.user?.email});
     if(user && user.isAccountNew) return {
          redirect: {
               destination: session?.user?.isOauth ? "/welcome/oauth" : '/welcome',
               permanent: false,
          },
     }
     return {props: {users}}
}