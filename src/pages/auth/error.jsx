import Link from "next/link";
import Image from "next/image";
import { BtnLink } from "@/components/formComponents/button";
import FeedLayout from "@/components/feed/FeedLayout";

export default function AuthError(){
     return <FeedLayout type="main">
          <div className="form-container verification">
               <Link href="/feed"><Image src="/logos/logo-white.svg" alt="harts" width={200} height={100} priority/></Link>
               <div className="msg">Վայ․․․ Սխալ առաջացավ</div>
               <BtnLink href="/auth/signin" btnStyle="outline-white">Մուտք գործել</BtnLink>
          </div>
     </FeedLayout>
}