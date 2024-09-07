import { generateId } from "@/lib/helpers";
import connectDB from "@/lib/tools/connectDb"
import { sendEmailVerification } from "@/lib/tools/resend";
import EmailToken from "@/model/EmailToken";
import User from "@/model/User";

export default async function handler(req,res){
     if(req.method==="POST"){
          try{
               await connectDB()
               const {email} = req.body
               const user = await User.findOne({email})
               if(user){
                    const {name, email} = user;
                    const token = await EmailToken.findOne({email: email.toLowerCase()});
                    if(!token){
                         const expirationDate = new Date();
                         expirationDate.setHours(expirationDate.getHours()+2);
                         const tokenData = {
                              email: email.toLowerCase(),
                              token: generateId(30),
                              expirationDate
                         }
                         const newToken = new EmailToken(tokenData)
                         await newToken.save();
                         const {error} = await sendEmailVerification({...tokenData,name});
                         if(error) console.error(error)
                    }
                    res.status(200).json({message: "Հաստատման նամակը ուղարկված է"})
               } else {
                    res.status(404).json({message: "Այս հաշիվը Գրանցված չէ"})
               }
          } catch(err){
               res.status(500).json({message: 'Վայ․․․ Սխալ առաջացավ'})
          }
     }
}