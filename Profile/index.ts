// Importer la bibliothèque Express avec la syntaxe ES modules
import express from "express";
import cors from "cors";
const profile = require("./src/rote/posts.ts");
const statistique = require("./src/rote/static.ts");
import { Server as SocketServer } from "socket.io";
import multer from "multer";

const host = "localhost";
// require('./globals'); // Importez le fichier globals.js pour initialiser la variable globale

// const cors = require("cors");

// Créer une instance d'application Express
// Définir le port sur lequel le serveur écoutera
const port = 3001;

const app = express();
const corsOptions = {
  origin: `http://${host}:4200`, // Remplacez par l'origine de votre application Angular
};

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "posts/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const uploadPost = multer({
  storage,
});
app.post(
  "/upload-image-post",
  uploadPost.single("imageProfilFile"),
  (req, res) => {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Aucun fichier image n'a été envoyé." });
    }
    console.log(req.file.filename);
    return res.status(200).json(req.file.filename);
  }
);

app.use("/api/profile", profile);
app.use("/api/statics", statistique);
app.use("/posts", express.static("posts")); //express static c'est repertoire from laquelle va effectuer aprendre des donner
app.use("/static", express.static("static")); //express static c'est repertoire from laquelle va effectuer aprendre des donner

// // Définir une route pour la page d'accueil
// app.get("/**", (req: any, res: any) => {
//   res.send("Hello, World!");
// });



// Démarrer le serveur
const server = app.listen(port, host, () => {
  console.log(`Serveur Express en cours d'exécution sur le port ${port}`);
});

const io = new SocketServer(server, {
  cors: {
    origin: `http://localhost:4200`,
    credentials: true,
  },
});

// // Assignez une valeur à la variable globale
// global.globalMap = new Map<string, string>();
// // Déclaration en tant que variable globale
//   io.on("connection", (socket) => {
//     // console.log(socket.id)
// socket.on("setup",(id)=>{
//   socket.join(id);
//   console.log(id);
//   socket.emit("connected",4);
// })
// socket.on("join chat",(id)=>{
//   socket.join(id);
//   console.log(id);
//   socket.emit("connected",4);
// })

// socket.on("join chat",(id)=>{
//   socket.join(id);
//   console.log(id);
//   socket.emit("connected",4);
// })
// socket.on("message",(message)=>{

//   socket.to(message.id).emit("msgenvoyer",message.message);
// })
// });

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId)
    })
  })
});
