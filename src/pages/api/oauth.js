import connectDB from "@/lib/tools/connectDb"
import User from "@/model/User";

export default async function handler(req,res){
     if(req.method==='PUT') try{
          await connectDB();
          const {formData, email} = req.body;
          const {organization, bdate, favoriteSubject} = formData;
          const updated = await User.updateOne({email},{$set: {organization,bdate: new Date(bdate),isAccountNew: false,favoriteSubject}});
          res.status(200).json(updated)
     } catch (e) {
          console.error(e.message)
          res.status(500).json({message: 'Վայ․․․ Սխալ առաջացավ'})
     }
}