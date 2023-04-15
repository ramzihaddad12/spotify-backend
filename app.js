import express from 'express'
import cors from 'cors'
import session from 'express-session';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import SessionController from "./controllers/sessions/sessions-controller.js";
import UserController from "./controllers/users/users-controller.js"
import SongsController from "./controllers/songs/songs-controller.js";
import AlbumsController from "./controllers/albums/albums-controller.js";
import PlaylistController from "./controllers/playlist/playlist-controller.js";

const app = express();
const sess = session.SessionOptions = {
    secret: "my-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
};
if (process.env.ENV === 'PROD') {
    app.set('trust proxy', 1);
    sess.cookie.secure = true;
    sess.cookie.sameSite = 'none';
}
app.use(session(sess));
app.use(cors({ credentials: true, origin: process.env.ORIGIN }));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://Cluster21145:Cluster21145@cluster21145.yc3qyis.mongodb.net/test', { useNewUrlParser: true });
UserController(app)
SessionController(app)
SongsController(app)
AlbumsController(app)
PlaylistController(app)

app.listen(process.env.PORT || 4000);
