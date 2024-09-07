import { generateId } from "@/lib/helpers";
import connectDB from "@/lib/tools/connectDb";
import { sendPasswordReset } from "@/lib/tools/resend";
import PassResetToken from "@/model/PassResetToken";
import User from "@/model/User";

export default async function handler(req,res){
     const {email} = req.body;
     if(req.method==='POST') try{
          await connectDB();
          const user = await User.findOne({email});
          if(!user) res.status(404).json({message: "Այս Օգտատերը չի գտնվել"})
          let token = await PassResetToken.findOne({id: user.userId});
          if(!token) token = await new PassResetToken({
               id: user.userId,
               token: generateId(30)
          }).save();
          const {error} = await sendPasswordReset(user.name,email,token.token);
          if(error) console.error(error)
          res.status(200).json({message: "Գաղտնաբառը վերականգնելու հղումը ուղարկված է"})
     } catch(e){
          console.error(e.message)
          res.status(500).json({message: 'Վայ․․․ Սխալ առաջացավ'})
     }
}