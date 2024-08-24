import connectDB from "@/lib/tools/connectDb";
import HartsQuiz from "@/model/Quiz";
import User from "@/model/User";
import { generateId } from "@/lib/helpers";

export default async function handler(req,res){
     const {visibility, id, email} = req.query;
     if(req.method==='POST'){
          await connectDB();
          const {reqType} = req.body;
          if(reqType==='duplicate'){
               const {quizId} = req.body;
               const mentionedQuiz = await HartsQuiz.findOne({id: quizId});
               const duplObj = {...mentionedQuiz._doc, id: generateId(12,'username')};
               const {_id,...rest} = duplObj;
               const duplicatedQuiz = new HartsQuiz({...rest, name: `«${rest.name}»-ի կրկնօրինակ`});
               await duplicatedQuiz.save();
               res.status(200).json(duplicatedQuiz)
          } else {
               const {quizData, email} = req.body;
               const mentionedQuiz = await HartsQuiz.findOne({id: quizData.id});
               if(mentionedQuiz) res.status(400).json({msg: 'Նշված հարցաշարը արդեն կա'})
               else {
                    const user = await User.findOne({email}) 
                    const newQuizData = {
                         ...quizData,
                         teacher: user?.name,
                         teacherEmail: email,
                         questions: quizData.questions.map(val=>{
                              const {id,...rest} = val;
                              return rest;
                         })
                    };
                    const newQuiz = new HartsQuiz(newQuizData);
                    await newQuiz.save();
                    res.status(200).json(newQuiz)
               }
          }
     } else if(req.method==='PUT'){
          await connectDB();
          const {quizData} = req.body;
          const newData = {...quizData, questions: quizData.questions.map(val=>{
               const {id,...rest} = val;
               return rest;
          })}
          const result = await HartsQuiz.updateOne({id: quizData.id},{$set: newData})
          res.status(200).json(result)
     } else if(req.method==='DELETE'){
          await connectDB();
          await User.updateMany({},{$pull: {favorites: id}})
          const result = await HartsQuiz.deleteOne({id});
          res.status(200).json(result)
     } else if(req.method==='PATCH'){
          await connectDB();
          const {email,quizId} = req.body;
          const user = await User.findOne({email});
          if(user){
               if(user.favorites.includes(quizId)){
                    await user.favorites.pull(quizId)
               } else {
                    await user.favorites.push(quizId)
               }
               await user.save();
          }
          res.status(200).json(user)
     } else {
          await connectDB();
          const questions = visibility==='public' ? await HartsQuiz.find({visibility: 'public'}) : visibility==='private' ? await HartsQuiz.find({visibility: 'private'}) : id ? await HartsQuiz.findOne({id}) : email ? await HartsQuiz.find({teacherEmail: email}) : await HartsQuiz.find();
          res.status(200).json(questions)
     }
}