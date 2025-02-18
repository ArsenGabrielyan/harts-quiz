import { createServer } from "node:http";
import next from "next";
import {Server} from "socket.io";
import { IQuizUser } from "@/data/types";

const dev = process.env.NODE_ENV!=="production";
const port = parseInt(process.env.PORT || "3000",10);
const hostname = process.env.HOSTNAME || "localhost"

const app = next({dev,hostname,port,turbopack: true});
const handle = app.getRequestHandler();

function devLog(message: string){
     if(process.env.NODE_ENV==="development") {
          console.info(message)
     }
}

app.prepare().then(()=>{
     const rooms: Record<string,IQuizUser[]> = {};
     const server = createServer(handle)
     const io = new Server(server);

     io.on('connection',socket=>{
          devLog("Socket Connected")
          socket.on('disconnect',()=>{
               for(const room in rooms){
                    if(rooms[room]){
                         rooms[room] = rooms[room].filter(p=>p.socketId!==socket.id);
                         io.to(room).emit("update players",rooms[room])
                    }
               }
               devLog("Socket Disconnected")
          })
          socket.on('join room',id=>{
               socket.join(id);
               devLog(`Joined Room ${id}`)
          })
          socket.on('join',formData=>{
               const {name: playerName,userId,quizId,points} = formData
               if(!rooms[quizId]) rooms[quizId] = [];
               rooms[quizId].push({name: playerName, userId, points, socketId: socket.id, quizId});
               socket.join(quizId);
               io.to(quizId).emit("update players",rooms[quizId])
               devLog(`${playerName} Joined Quiz ${quizId}`)
          })
          socket.on('leave',formData=>{
               for(const room in rooms){
                    if(rooms[room]){
                         rooms[room] = rooms[room].filter(p=>p.userId!==formData.userId);
                         io.to(room).emit("update players",rooms[room])
                    }
               }
               devLog(`${formData.playerName} Left`)
          })
          socket.on('start game',(quiz,index,quizId)=>{
               io.to(quizId).emit('start quiz',quiz,index)
               devLog(`Quiz ${quizId} has been started`)
          })
          socket.on('next round',(index,quizId)=>{
               io.to(quizId).emit('start round',index)
          })
          socket.on('round end',(answer,point,correct,userId,room)=>{
               const players = rooms[room];
               const isCorrect = `${answer}`.toLowerCase()===`${correct}`.toLowerCase()
               for(let i=0;i<players.length;i++)
                    if(players[i].userId===userId && isCorrect)
                         players[i].points += point;
               io.to(room).emit('end round',players)
          })
          socket.on('finish quiz',(room,placement)=>{
               io.to(room).emit('end quiz',placement)
               devLog("Showing results")
          })
          socket.on('reset quiz',room=>{
               delete rooms[room];
               io.to(room).emit('reset game')
               devLog("Quiz Finished!")
          })
     })

     server.once("error",(err)=>{
          console.error(err);
          process.exit(1);
     })
     .listen(port,()=>{
          console.info(`> Ready on http://localhost:${port}/`)
     })
})