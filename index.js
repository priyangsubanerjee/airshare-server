const express = require("express");
const app = express();
const port = process.env.PORT || 5589;
const server = require("http").createServer(app);
const path = require("path");
const cors = require("cors");

const io = require("socket.io")(server, {
  cors: {
    origin: "http://airdropio.vercel.app",
    methods: "GET,PUT,POST,DELETE,OPTIONS".split(","),
    credentials: true,
  },
});

let users = [];

const hostdir =
  process.env.NODE_ENV === "production"
    ? "https://airdropserver.herokuapp.com"
    : "http://192.168.1.36:5589";

app.use(cors());
app.use(express.static(path.join(__dirname, "./public")));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  console.log("user connected: " + socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected: " + socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
