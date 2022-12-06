const express = require("express");
const app = express();
const port = process.env.PORT || 5589;
const server = require("http").createServer(app);
const path = require("path");
const cors = require("cors");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: "GET,PUT,POST,DELETE,OPTIONS".split(","),
    credentials: true,
  },
});

let users = [];

app.use(cors());
app.use(express.static(path.join(__dirname, "./public")));

app.get("/", (req, res) => {
  res.send(
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo excepturi voluptatum, ex nisi illum unde animi omnis optio earum, possimus, aperiam repellat cupiditate autem! Nobis vitae laborum quo non consequatur."
  );
});

io.on("connection", (socket) => {
  console.log("user connected: " + socket.id);

  socket.on("join-room", (data) => {
    socket.join(data.room);
    users.push(data);

    let usersInRoom = users.filter((user) => user.room === data.room);

    socket.emit("you-have-joined-room", {
      message: `You have joined the room.`,
      id: socket.id,
      name: data.name,
      room: data.room,
      users: usersInRoom,
    });

    socket.on("test-connection", (data) => {
      data.to.map((client) => {
        socket.to(client.id).emit("test-connection-alert", data);
      });
    });

    socket.on("send-message-obj", (data) => {
      data.to.map((client) => {
        socket.to(client.id).emit("receive-message-obj", data);
      });
    });

    io.to(data.room).emit("users-in-room", {
      message: `${data.id} has joined the room.`,
      id: socket.id,
      users: usersInRoom,
    });
  });

  socket.on("disconnect", () => {
    const user = users.find((user) => user.id === socket.id);
    if (user) {
      const index = users.indexOf(user);
      users.splice(index, 1);

      const usersInRoom = users.filter((i) => user.room === i.room);

      io.to(user.room).emit("users-in-room", {
        message: `${user.id} has left the room.`,
        users: usersInRoom,
      });
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
