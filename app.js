import express from 'express'
import cors from 'cors'
import session from 'express-session';
import mongoose from 'mongoose';
import SessionController from "./controllers/sessions/sessions-controller.js";
import UserController from "./controllers/users/users-controller.js"
import SongsController from "./controllers/songs/songs-controller.js";
import AlbumsController from "./controllers/albums/albums-controller.js";
import PlaylistController from "./controllers/playlist/playlist-controller.js";

const app = express();

// app.use(session({
//     resave: false,
//     saveUninitialized: true,
//     secret: 'sdlfjljrowuroweu',
//     cookie: { secure: false },
// }));
app.set('trust proxy', 1);

app.use(
    session({
        secret: "any string",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

app.use(cors({
    credentials: true,
    origin: 'https://flourishing-tanuki-d1c818.netlify.app' //'http://localhost:3000'
}));
app.use(express.json());


mongoose.connect('mongodb+srv://Cluster21145:Cluster21145@cluster21145.yc3qyis.mongodb.net/test', { useNewUrlParser: true });
UserController(app)
SessionController(app)
SongsController(app)
AlbumsController(app)
PlaylistController(app)

app.listen(process.env.PORT || 4000);
