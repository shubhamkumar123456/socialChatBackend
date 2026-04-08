const express = require("express");
const port = process.env.PORT || 2000;
const app = express();
const connectToDb = require("./db");
connectToDb();
var cors = require("cors");
const socketIO = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://social-media-woad-five.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});
// const fileUpload = require("express-fileupload");
const UserRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const conversationRoutes = require("./routes/conversation");
const messagesRoutes = require("./routes/message");
const cookieParser = require("cookie-parser");

// const {addUser ,removeUser , getUser} = require('./users')
console.log(process.env.Mode);
console.log(
  process.env.Mode === "developement"
    ? process.env.MONGO_LOCAL
    : process.env.MONGODB_URL,
);
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://social-media-woad-five.vercel.app",
    ], // your frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    transports: ["websocket"],
  }),
);
// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp/",
//   })
// );

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
// app.use(express.urlencoded({ limit: '50mb' }));
app.get("/", (req, res) => {
  res.send("home page");
});
app.use("/api/users", UserRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/uploads", express.static("uploads"));

let users = {};
console.log(users);

const addUser = (userId, socketId) => {
  users[userId] = socketId;
  console.log(users);
};

const removeUser = (socketId) => {
  // Find the userId belonging to this socketId and delete it
  for (const userId in users) {
    if (users[userId] === socketId) {
      delete users[userId];
      break;
    }
  }
  console.log("User removed. Remaining:", users);
};

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    console.log("user joined", userId);
    addUser(userId, socket.id);
    // io.emit("getUsers", users);
  });

  //send and get messages
  socket.on("sendMessage", ({ senderId, recieverId, text }) => {
    const recieverSocket = users[recieverId];
    if (recieverSocket) {
      socket.to(recieverSocket).emit("getMessage", {
        senderId,
        recieverId,
        text,
        createdAt: new Date(),
      });
    }
  });

  //when disconnect user
  socket.on("disconnect", (userId) => {
    console.log("user has left");
    removeUser(userId, socket.id);
    // io.emit("getUsers", users);
  });

  // socket.on('sendMessage',({conversationId,sender,text})=>{
  //     const user = getUser(socket.id);
  //     console.log(user)
  //     socket.emit('message',{conversationId,sender,text});
  // })
});

server.listen(port, () => {
  console.log("surver is running on port ", port);
});
