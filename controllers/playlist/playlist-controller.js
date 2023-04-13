
//create song within album
import User from "../../models/user.js";
import Song from "../../models/song.js";
import Playlist from "../../models/playlist.js";
import Playlist2Song from "../../models/playlist2song.js";
import Like from "../../models/like.js";
const createPlaylist = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Create the playlist
        const playlist = new Playlist({
            name: req.body.name,
            description: req.body.description,
            userId: userId
        });

        // Save the song to the database
        await playlist.save();;
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};


const getSongsInPlaylist = async (req, res) => {
    const songs = await Playlist2Song.find({ playlist: req.params.playlistId });
    const songIds = songs.map((song) => song.song.toString());

    res.json(songIds);
};
const getAllPlaylists = async (req, res) => {

    try {
        const playlists = await Playlist.find({userId: req.params.userId});
        res.status(200).json(playlists);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};
const addSongToPlaylist = async (req, res) => {
    const playlistId = req.params.playlistId;
    const playlist2Song = new Playlist2Song({
        playlist: playlistId,
        song: req.body.songId
    });
    await playlist2Song.save();
};

const removeSongFromPlaylist = async (req, res) => {
    await Playlist2Song.deleteOne({playlist: req.params.playlistId, song: req.body.songId});
};

const deletePlaylist = async (req, res) => {
    const playlistId = req.params.playlistId;

    try {
        const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

        if (!deletedPlaylist) {
            return res.status(404).json({ error: "Playlist not found" });
        }

        res.status(200).json({ message: "Playlist deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

const getSongIdsInPlaylist = async (req, res) => {
    const playlistId = req.params.playlistId;

    try {
        const playlist = await Playlist.findById(playlistId);
        const songIds = playlist.songs;

        res.status(200).json(songIds);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};


export default (app) => {
    app.post('/api/playlists/:userId', createPlaylist);
    app.get('/api/playlists/:userId', getAllPlaylists);

    app.get('/api/playlists/:playlistId/songIds', getSongsInPlaylist);
    app.put('/api/playlists/add/:playlistId', addSongToPlaylist);
    app.put('/api/playlists/remove/:playlistId', removeSongFromPlaylist);

    app.delete('/api/playlists/:playlistId', deletePlaylist);
}
