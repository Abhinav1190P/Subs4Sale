const express = require('express')

const app = express()
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose')
const socket = require('socket.io')

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());


const connectDB = async () => {
    await mongoose.connect('mongodb://127.0.0.1/Subs4Sale');

    console.log("Mongodb connected")
};

connectDB()
mongoose.promise = global.Promise

app.use("/api/users", require("./routes/user_routes"));
app.use("/api/ads", require('./routes/ads_route'))
app.use("/api/message", require('./routes/message_route'))
app.use("/api/fav",require('./routes/fav_routes'))
app.use("/api/notification",require('./routes/notification_route'))
const server = app.listen(3001, () => {
    console.log("Server running on 3001")
})


io = socket(server)

// ...

io.on('connection', (socket) => {
    socket.on('joinRoomStart', ({ roomID }) => {
        console.log(roomID)
      socket.join(roomID);
    });
  
    socket.on('sendMessage', ({ currentRoom, currentMessage,sender,file }) => {
     
      io.to(currentRoom).emit('message', {currentMessage,sender,file});
    });

    socket.on('disconnect', () => {
        console.log('User disconnected')
    })
    
  });
  
  // ...
  

