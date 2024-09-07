import connectDB from "@/lib/tools/connectDb"
import HartsQuiz from "@/model/Quiz";
import User from "@/model/User";
import { hash } from "bcrypt";

export default async function handler(req,res){
     const {id} = req.query;
     if(req.method==='PUT'){
          await connectDB();
          const {type} = req.body
          if(type && type==='changePass'){
               const {password, email} = req.body;
               const hashed = await hash(password,12)
               const updated = await User.updateOne({email},{$set: {password: hashed}});
               res.status(updated ? 200 : 400).json({msg: updated ? 'Կարգավորումները թարմացված են' : 'Չհաջողվեց թարմացնել կարգավորումները'})
          } else {
               const {formData, email} = req.body;
               await HartsQuiz.updateMany({teacherEmail: email},{$set: {teacherEmail: formData.email, teacher: formData.name}})
               const updated = await User.updateOne({email},{$set: formData});
               res.status(updated ? 200 : 400).json({msg: updated ? 'Կարգավորումները թարմացված են' : 'Չհաջողվեց թարմացնել կարգավորումները'})
          }
     } else if(req.method==='DELETE'){
          await connectDB();
          const user = await User.findOne({userId: id});
          if(user){
               const questions = await HartsQuiz.find({teacherEmail: user?.email});
               if(questions){
                    questions.forEach(val=>User.updateMany({},{$pull: {favorites: val.id}}))
                    await HartsQuiz.deleteMany({teacherEmail: user?.email});
               }
               const deleted = await User.deleteOne({userId: id})
               res.status(deleted ? 200 : 400).json({msg: deleted ? 'Ձեր հաշիվը ջնջվել է' : 'Չհաջողվեց ջնջել հաշիվը'})
          } else {
               res.status(400).json({msg: 'Չհաջողվեց ջնջել այս հաշիվը, որովհետև այս հաշիվը գրանցված չէ'})
          }
     } else {
          await connectDB();
          const {email} = req.query;
          const users = email ? await User.findOne({email}) : id ? await User.findOne({userId: id}) : await User.find();
          res.status(200).json(users)
     }
}