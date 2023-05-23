import { Server } from "socket.io";

const io = new Server(3000, {
    cors: {
        origin: '*',
        methods: ['POST', 'GET']
    }
});

io.on("connection", (socket) => {
    console.log('A user has joined.')
    socket.on('disconnect', () => {
        console.log('User has left.')
    })
});