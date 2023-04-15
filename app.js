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
import MongoStore from "connect-mongo";
// const app = express();
//
// // app.use(session({
// //     resave: false,
// //     saveUninitialized: true,
// //     secret: 'sdlfjljrowuroweu',
// //     cookie: { secure: false },
// // }));
// // app.set('trust proxy', 1);
//
// app.use(
//     session({
//         // store: new MongoStore({
//         //     url: 'mongodb+srv://Cluster21145:Cluster21145@cluster21145.yc3qyis.mongodb.net/test',
//         //     ttl: 14 * 24 * 60 * 60, // session expiration time in seconds
//         //     autoRemove: 'native', // automatically remove expired sessions
//         //     collectionName: 'sessions' // collection name for the sessions
//         // }),
//         secret: "any string",
//         resave: false,
//         saveUninitialized: true,
//         cookie: {
//             secure: false
//         }
//     })
// );
//
// app.use(cors({
//     credentials: true,
//     origin: 'http://localhost:3000' //'https://flourishing-tanuki-d1c818.netlify.app' //
// }));
// app.use(express.json());
const app = express();
const sess = session.SessionOptions = {
    secret: "process.env.SECRET",
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
app.use(cors({ credentials: true, origin: "https://flourishing-tanuki-d1c818.netlify.app" }));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://Cluster21145:Cluster21145@cluster21145.yc3qyis.mongodb.net/test', { useNewUrlParser: true });
UserController(app)
SessionController(app)
SongsController(app)
AlbumsController(app)
PlaylistController(app)

app.listen(process.env.PORT || 4000);
