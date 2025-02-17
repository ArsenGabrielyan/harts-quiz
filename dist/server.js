"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = require("node:http");
const next_1 = __importDefault(require("next"));
const socket_io_1 = require("socket.io");
const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);
const app = (0, next_1.default)({ dev, hostname, port });
const handler = app.getRequestHandler();
function devLog(message) {
    if (process.env.NODE_ENV === "development") {
        console.info(message);
    }
}
app.prepare().then(() => {
    const rooms = {};
    const server = (0, node_http_1.createServer)(handler);
    const io = new socket_io_1.Server(server);
    io.on('connection', socket => {
        devLog("Socket Connected");
        socket.on('disconnect', () => {
            for (let room in rooms) {
                if (rooms[room]) {
                    rooms[room] = rooms[room].filter(p => p.socketId !== socket.id);
                    io.to(room).emit("update players", rooms[room]);
                }
            }
            devLog("Socket Disconnected");
        });
        socket.on('join room', id => {
            socket.join(id);
            devLog(`Joined Room ${id}`);
        });
        socket.on('join', formData => {
            const { name: playerName, userId, quizId, points } = formData;
            if (!rooms[quizId])
                rooms[quizId] = [];
            rooms[quizId].push({ name: playerName, userId, points, socketId: socket.id, quizId });
            socket.join(quizId);
            io.to(quizId).emit("update players", rooms[quizId]);
            devLog(`${playerName} Joined Quiz ${quizId}`);
        });
        socket.on('leave', formData => {
            for (let room in rooms) {
                if (rooms[room]) {
                    rooms[room] = rooms[room].filter(p => p.userId !== formData.userId);
                    io.to(room).emit("update players", rooms[room]);
                }
            }
            devLog(`${formData.playerName} Left`);
        });
        socket.on('start game', (quiz, index) => {
            io.to(quiz.id).emit('start quiz', quiz, index);
            devLog(`Quiz ${quiz.id} has been started`);
        });
        socket.on('next round', (quiz, index) => io.to(quiz.id).emit('start round', index));
        socket.on('round end', (answer, point, correct, userId, room) => {
            const players = rooms[room];
            const isCorrect = `${answer}`.toLowerCase() === `${correct}`.toLowerCase();
            for (let i = 0; i < players.length; i++)
                if (players[i].userId === userId && isCorrect)
                    players[i].points += point;
            io.to(room).emit('end round', players);
        });
        socket.on('finish quiz', (room, placement) => {
            io.to(room).emit('end quiz', placement);
            devLog("Showing results");
        });
        socket.on('reset quiz', room => {
            delete rooms[room];
            io.to(room).emit('reset game');
            devLog("Quiz Finished!");
        });
    });
    server.once("error", (err) => {
        console.error(err);
        process.exit(1);
    })
        .listen(port, () => {
        console.info(`> Ready on http://${hostname}:${port}`);
    });
});
