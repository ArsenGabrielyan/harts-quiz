import { generateId } from "@/lib/helpers";
import connectDB from "@/lib/tools/connectDb";
import PassResetToken from "@/model/PassResetToken";
import User from "@/model/User";
import { hash } from "bcrypt";

export default async function handler(req,res){
     const {email,token,newPass} = req.body;
     if(req.method==='POST') try{
          await connectDB();
          const user = await User.findOne({email});
          if(!user) res.status(404).json({message: "Այս Օգտատերը չի գտնվել"})
          const claimedToken = await PassResetToken.findOne({id: user.userId,token});
          if(!claimedToken) res.status(400).json({message: "Այս Token-ը չի գտնվել"})
          const hashed = await hash(newPass,12)
          await User.updateOne({email},{$set: {password: hashed}});
          await PassResetToken.deleteOne({id: user.userId,token})
          res.status(200).json({message: "Գաղտնաբառը վերականգնվել է"})
     } catch(e){
          console.error(e.message)
          res.status(500).json({message: 'Վայ․․․ Սխալ առաջացավ'})
     }
}