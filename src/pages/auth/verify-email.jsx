import connectDB from "@/lib/tools/connectDb";
import EmailToken from "@/model/EmailToken";
import User from "@/model/User";
import Link from "next/link";
import Image from "next/image";
import { BtnLink } from "@/components/formComponents/button";
import FeedLayout from "@/components/feed/FeedLayout";

export default function VerifyEmail({msg}){
     return <FeedLayout type="main">
          <div className="form-container verification">
               <Link href="/feed"><Image src="/logos/logo-white.svg" alt="harts" width={200} height={100} priority/></Link>
               {msg && msg.message!=='' && <div className={`msg ${msg.success ? "success" : ''}`.trim()}>{msg.message}</div>}
               <BtnLink href="/auth/signin" btnStyle="outline-white">Մուտք գործել</BtnLink>
          </div>
     </FeedLayout>
}
export const getServerSideProps = async ctx => {
     await connectDB();
     const {token} = ctx.query;
     const tokenReq = await EmailToken.findOne({token});
     if(!tokenReq) return {props: {msg: {
          success: false,
          message: 'Այս token-ը չկա'
     }}}
     else if(new Date(tokenReq.expirationDate) < new Date()) return {props: {msg: {
          success: false,
          message: 'Այս token-ի ժամկետը լրացել է'
     }}}
     else {
          const user = await User.updateOne({email: tokenReq.email},{$set: {isEmailVerified: true}})
          if(user){
               const result = {props: {msg: {
                    success: true,
                    message: 'Այս հաշիվը հաստատված է'
               }}};
               await EmailToken.deleteOne({token});
               return result
          } else {
               return {props: {msg: {
                    success: false,
                    message: 'Այս էլ․ փոստի հացեն գրանցված չէ'
               }}}
          }
     }
}