
//create song within album
import Album from "../../models/album.js";
import Song from "../../models/song.js";
import User from "../../models/user.js";
import mongoose from 'mongoose';

const createSong = async (req, res) => {
    const userId = req.params.userId;


    try {
        // get username
        const user = await User.findById(userId);
        const userName = user.name;
        // Check if the album exists
        const album = await Album.findById(req.body.albumId);
        if (!album) {
            return res.status(404).json({ error: "Album not found" });
        }

        // Create the song
        const song = new Song({
            name: req.body.name,
            duration_ms: req.body.duration_ms,
            albumId: req.body.albumId,
            artists: [{name: userName}],
            album: {images: [{url: album.images[0].url}]}
        });

        // Save the song to the database
        await song.save();

        res.status(201).json(song);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};



const getSongsInAlbum = async (req, res) => {
    const albumId = req.params.albumId;

    try {
        const songs = await Song.find({ albumId: albumId });

        if (songs.length === 0) {
            return res.status(404).json({ error: "No songs found for this album" });
        }

        res.status(200).json(songs);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};
const getAllSongs = async (req, res) => {
    try {
        const songs = await Song.find();
        res.status(200).json(songs);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};
const updateSong = async (req, res) => {
    const songId = req.params.songId;

    try {
        const song = await Song.findByIdAndUpdate(
            songId,
            { $set: req.body },
            { new: true }
        );

        if (!song) {
            return res.status(404).json({ error: "Song not found" });
        }

        res.status(200).json(song);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

const deleteSong = async (req, res) => {
    const songId = req.params.songId;

    try {
        const deletedSong = await Song.findByIdAndDelete(songId);

        if (!deletedSong) {
            return res.status(404).json({ error: "Song not found" });
        }

        res.status(200).json({ message: "Song deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

const getSongById = async (req, res) => {
    // Check if songId is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(req.params.songId)) {
        try {
            const song = await Song.findById(req.params.songId);
            if (song) {
                res.status(200).json(song);
            }

            else {
                res.status(200).json({});
            }
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    }
    else {
        res.status(200).json({});
    }

};
export default (app) => {
    app.post('/api/songs/:userId', createSong);
    // app.get('/api/songs', getAllSongs);
    app.get('/api/songs/:albumId', getSongsInAlbum);
    app.get('/api/songs/check/:songId', getSongById);

    app.put('/api/songs/:songId', updateSong);
    app.delete('/api/songs/:songId', deleteSong);
}
