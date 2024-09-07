import { generateId } from "@/lib/helpers";
import connectDB from "@/lib/tools/connectDb"
import { sendEmailVerification } from "@/lib/tools/resend";
import EmailToken from "@/model/EmailToken";
import User from "@/model/User";
import {hash} from "bcrypt";

export default async function handler(req,res){
     if(req.method==='POST') {
          try{
               await connectDB();
               const {signupData} = req.body;
               const user = await User.findOne({email: signupData.email});
               if(user) res.status(404).json({message: "Այս հաշիվը արդեն գրանցված է"})
               else {
                    const {name, email, bdate, password} = signupData;
                    const hashed = await hash(password,12)
                    const userDetails = {
                         name, email: email.toLowerCase(), 
                         bdate: new Date(bdate),
                         username: "",
                         organization: '',
                         password: hashed,
                         image: null,
                         userId: generateId(10),
                         accountType: '',
                         bio: '',
                         details: {
                              favorites: [],
                              followed: []
                         },
                         favoriteSubject: ''
                    }
                    const newUser = new User(userDetails);
                    await newUser.save();
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
               }
          } catch(e){
               console.error(e.message)
               res.status(500).json({message: 'Վայ․․․ Սխալ առաջացավ'})
          }
     } else if(req.method==='PUT'){
          try{
               await connectDB();
               const {formData, email} = req.body;
               const user = await User.findOne({email});
               if(user){
                    const {accountType, organization, username, image, favoriteSubject} = formData;
                    const takenUsername = await User.findOne({username: formData.username})
                    const newUsernamefromTaken = `${formData.username.toLowerCase().replace(/[0-9]/g,'')}-${generateId(10,'username')}`;
                    const updated = await User.updateOne({email},{$set: {
                         accountType,organization,image,
                         isAccountNew: false,
                         username: !username ? `${accountType}-${generateId(10,'username')}` : takenUsername ? newUsernamefromTaken : username,
                         favoriteSubject
                    }})
                    res.status(200).json(updated)
               } else {
                    res.status(404).json({message: 'Այսպիսի օգտվող չի գտնվել'})
               }
          }  catch(e){
               console.error(e.message)
               res.status(500).json({message: 'Վայ․․․ Սխալ առաջացավ'})
          }
     }  
}