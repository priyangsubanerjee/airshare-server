const express = require("express");
const app = express();
const port = process.env.PORT || 5589;
const server = require("http").createServer(app);
const path = require("path");
const cors = require("cors");

const io = require("socket.io")(server, {
  cors: {
    origin: "https://airshare-six.vercel.app",
    methods: "GET,PUT,POST,DELETE,OPTIONS".split(","),
    credentials: true,
  },
});

let users = [];
let files = [];

app.use(cors());
app.use(express.static(path.join(__dirname, "./public")));

app.get("/", (req, res) => {
  res.send(
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo excepturi voluptatum, ex nisi illum unde animi omnis optio earum, possimus, aperiam repellat cupiditate autem! Nobis vitae laborum quo non consequatur."
  );
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
