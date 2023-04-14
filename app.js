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

app.set('trust proxy', 1);

app.use(express.json());

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'my-secret',
    cookie: { secure: true }
}));

app.use(cors({
    credentials: true,
    origin: 'https://flourishing-tanuki-d1c818.netlify.app'
}));
app.set('trust proxy', 1);

mongoose.connect('mongodb+srv://Cluster21145:Cluster21145@cluster21145.yc3qyis.mongodb.net/test', { useNewUrlParser: true });
UserController(app)
SessionController(app)
SongsController(app)
AlbumsController(app)
PlaylistController(app)

app.listen( 4000);