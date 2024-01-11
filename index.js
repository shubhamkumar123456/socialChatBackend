const express = require('express');
const port = process.env.PORT || 2000
const app = express();
const connectToDb = require('./db')
connectToDb();
var cors = require('cors')
const socketIO = require("socket.io");
const http=require("http");
const server=http.createServer(app);
const io=socketIO(server);
const fileUpload = require("express-fileupload");
const UserRoutes = require('./routes/user')
const postRoutes = require('./routes/post')
const conversationRoutes = require('./routes/conversation')
const messagesRoutes = require('./routes/message')
// const {addUser ,removeUser , getUser} = require('./users')


app.get('/', (req, res) => {
  res.send("home page")
})
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(cors())
app.use('/api/users', UserRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/conversation', conversationRoutes)
app.use('/api/messages', messagesRoutes)



 let users = [];
 console.log(users)
 const addUser = (userId,socketId)=>{
  !users.some(user=>user.userId===userId) && users.push({userId,socketId});
 }
 const removeUser = (socketId)=>{
  users = users.filter(user=>user.socketId!==socketId)
}

const getUser = (userId) => {
  console.log(users)
  console.log(userId)
let user = users.find(user=>user.userId===userId)
console.log("get users = ",user)
  return user;
}
//when connect user
io.on("connection",(socket)=>{
  socket.on('addUser',(userId)=>{
    console.log('user joined' , userId )
    addUser(userId,socket.id)
    io.emit("getUsers",users)
  })

  //send and get messages
  socket.on('sendMessage',({senderId,recieverId,text})=>{
      const user = getUser(recieverId);
      console.log("user = ", user)
    if(user){
      io.to(user.socketId).emit("getMessage",{
        senderId,
        text,
      })
    }
  })


  //when disconnect user
  socket.on('disconect',()=>{
      console.log('user has left')
      removeUser(socket.id)
      io.emit("getUsers",users)
  })


  // socket.on('sendMessage',({conversationId,sender,text})=>{
  //     const user = getUser(socket.id);
  //     console.log(user)
  //     socket.emit('message',{conversationId,sender,text});
  // })

});


server.listen(port, () => {
  console.log("surver is running on port ", port);
})