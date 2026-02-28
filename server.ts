import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { IQuizUser, IQuizDocumentQuestion } from "@/lib/types"

interface IRoundMeta {
     correctIndex: number;
     points: number;
}
interface IGameState {
     rounds: IRoundMeta[],
     currentRound: number,
     answeredSockets: Set<string>,
}

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3000", 10);
const hostname = process.env.HOSTNAME || "localhost"

const app = next({ dev, hostname, port, turbopack: true });
const handle = app.getRequestHandler();

const MAX_NAME_LENGTH = 100;
const MAX_PLAYERS_PER_ROOM = 50;

function devLog(message: string) {
     if (process.env.NODE_ENV === "development") {
          console.info(message)
     }
}

function sanitize(value: unknown): string {
     if (typeof value !== "string") return "";
     return value.trim().slice(0, MAX_NAME_LENGTH);
}

app.prepare().then(() => {
     const rooms: Record<string, IQuizUser[]> = {};
     const roomHosts: Record<string, string> = {};
     const gameStates: Record<string, IGameState> = {};

     const server = createServer(handle)
     const io = new Server(server);

     io.on('connection', socket => {
          devLog("Socket Connected")

          let lastRoundEnd = 0;
          const ROUND_END_COOLDOWN_MS = 500;

          socket.on('disconnect', () => {
               for (const room in rooms) {
                    if (rooms[room]) {
                         rooms[room] = rooms[room].filter(p => p.socketId !== socket.id);
                         io.to(room).emit("update players", rooms[room])
                    }
                    if (rooms[room]?.length === 0) {
                         delete rooms[room];
                         delete gameStates[room];
                    }
               }
               for (const room in roomHosts) {
                    if (roomHosts[room] === socket.id) {
                         delete roomHosts[room];
                         io.to(room).emit("host disconnected");
                         delete gameStates[room];
                    }
               }
               devLog("Socket Disconnected")
          })
          socket.on('join room', (id: unknown) => {
               const roomId = sanitize(id);
               if (!roomId) return;
               socket.join(roomId);
               roomHosts[roomId] = socket.id;
               devLog(`Host joined Room ${roomId}`)
          })
          socket.on('join', (formData: unknown) => {
               if (!formData || typeof formData !== "object") return;
               const { name, userId, quizId } = formData as Record<string, unknown>;

               const playerName = sanitize(name);
               const playerUserId = sanitize(userId);
               const playerQuizId = sanitize(quizId);

               if (!playerName || !playerUserId || !playerQuizId) return;
               if (!rooms[playerQuizId]) rooms[playerQuizId] = [];
               if (rooms[playerQuizId].length >= MAX_PLAYERS_PER_ROOM) return;

               const exists = rooms[playerQuizId].some(p => p.userId === playerUserId);
               if (!exists) {
                    rooms[playerQuizId].push({
                         name: playerName,
                         userId: playerUserId,
                         points: 0,
                         socketId: socket.id,
                         quizId: playerQuizId
                    });
               } else {
                    const player = rooms[playerQuizId].find(p => p.userId === playerUserId);
                    if (player) player.socketId = socket.id;
               }
               socket.join(playerQuizId);
               io.to(playerQuizId).emit("update players", rooms[playerQuizId])
               devLog(`${playerName} Joined Quiz ${playerQuizId}`)
          })
          socket.on('leave', (formData: unknown) => {
               if (!formData || typeof formData !== "object") return;
               const { userId } = formData as Record<string, unknown>;
               const playerUserId = sanitize(userId);
               if (!playerUserId) return;

               for (const room in rooms) {
                    rooms[room] = rooms[room].filter(p => p.userId !== playerUserId);
                    io.to(room).emit("update players", rooms[room])
                    if (rooms[room].length === 0) {
                         delete rooms[room];
                         delete gameStates[room];
                    }
               }
          })
          socket.on('round end', (answer: unknown, room: unknown) => {
               // Rate limit
               const now = Date.now();
               if (now - lastRoundEnd < ROUND_END_COOLDOWN_MS) return;
               lastRoundEnd = now;

               const roomId = sanitize(room);
               const players = rooms[roomId];
               const state = gameStates[roomId];
               if (!players || !state) return;

               const player = players.find(p => p.socketId === socket.id);
               if (!player) return;

               if (state.answeredSockets.has(socket.id)) return;
               state.answeredSockets.add(socket.id);

               const round = state.rounds[state.currentRound];
               if (!round) return;

               const isCorrect = answer === round.correctIndex
               if (isCorrect) player.points += round.points;

               io.to(roomId).emit("end round", players);
               setTimeout(() => {
                    io.to(roomId).emit("phase change", {
                         phase: "leaderboard",
                         index: state.currentRound
                    });
               }, 4000);
               console.log("ROUND:", state.currentRound);
               console.log("ANSWER:", answer);
               console.log("CORRECT:", round.correctIndex);
               console.log("IS CORRECT:", isCorrect);
          });
          socket.on('start game', (quiz: unknown, index: unknown, quizId: unknown) => {
               const roomId = sanitize(quizId);
               if (roomHosts[roomId] !== socket.id) return;
               if (!quiz || typeof quiz !== "object") return;

               const { questions } = quiz as { questions: IQuizDocumentQuestion[] };
               if (!Array.isArray(questions)) return;
               gameStates[roomId] = {
                    rounds: questions.map(q => ({
                         correctIndex: q.correctAnswerId ?? -1,
                         points: Number(q.points),
                    })),
                    currentRound: typeof index === "number" ? index : 0,
                    answeredSockets: new Set(),
               };
               const safeQuiz = {
                    ...(quiz as object),
                    questions
               };

               io.to(roomId).emit('start quiz', safeQuiz, index);
               devLog(`Quiz ${roomId} has been started`)
          })
          socket.on("next round", (roomRaw) => {
               const roomId = sanitize(roomRaw);
               const state = gameStates[roomId];
               if (!state) return;

               if (state.currentRound + 1 >= state.rounds.length) return;
               state.currentRound += 1;
               state.answeredSockets.clear();

               io.to(roomId).emit("phase change", {
                    phase: "countdown",
                    index: state.currentRound
               });
               console.log("ROUND:", state.currentRound);;
          });
          socket.on('finish quiz', (room: unknown, placement: unknown) => {
               const roomId = sanitize(room);
               if (roomHosts[roomId] !== socket.id) return;
               io.to(roomId).emit('end quiz', placement);
               devLog("Showing results")
          })
          socket.on('reset quiz', (room: unknown) => {
               const roomId = sanitize(room);
               if (roomHosts[roomId] !== socket.id) return;
               delete rooms[roomId];
               delete gameStates[roomId];
               io.to(roomId).emit('reset game');
               devLog("Quiz Finished!")
          })
          socket.on("countdown finished", (roomIdRaw: unknown) => {
               const roomId = sanitize(roomIdRaw);
               if (roomHosts[roomId] !== socket.id) return;
               const state = gameStates[roomId];
               if (!state) return;
               io.to(roomId).emit("phase change", {
                    phase: "question",
                    index: state.currentRound
               });
               console.log("ROUND:", state.currentRound);;
          });
     })

     server.once("error", (err) => {
          console.error(err);
          process.exit(1);
     })
     .listen(port, () => {
          console.info(`> Ready on http://${hostname}:${port}/`)
     })
})