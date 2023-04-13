import Album from "../../models/album.js"
import User from "../../models/user.js";
import Playlist from "../../models/playlist.js";
import Song from "../../models/song.js";
import mongoose from 'mongoose';

const createAlbum = async (req, res) => {
    try {
        // Create the album
        const album = new Album({
            name: req.body.name,
            artistId: req.params.userId,
            images: [{url: req.body.url}]
        });
        await album.save();
        res.status(201).json(album);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}


const findAlbums = async (req, res) => {
    try {
        const albums = await Album.find();
        res.status(200).json(albums);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

const getAlbumById = async (req, res) => {
    // Check if songId is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        try {
            const album = await Album.findById(req.params.id);
            if (album) {
                res.status(200).json(album);
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
const getAlbumSongsById = async (req, res) => {
    try {
        const album = await Album.findById(req.params.id);
        if (!album) {
            return res.status(404).send('Album not found');
        }
        const songs = await Song.find({"albumId": req.params.id});
        res.status(200).json(songs);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};
const updateAlbum = async (req, res) => {
    try {
        const album = await Album.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!album) {
            return res.status(404).send('Album not found');
        }
        res.status(200).json(album);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

const deleteAlbum = async (req, res) => {
    try {
        const album = await Album.findByIdAndDelete(req.params.id);
        if (!album) {
            return res.status(404).send('Album not found');
        }
        res.status(200).send('Album deleted');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

const getAllAlbums = async (req, res) => {
    try {
        const albums = await Album.find({"artistId": req.params.userId});

        res.status(200).json(albums);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

const getAllSortedAlbums = async (req, res) => {
    try {
        const albums = await Album.find().sort({ _id: -1 });

        res.status(200).json(albums);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

const searchAlbumByName = async (req, res) => {
    try {
        const query = req.query.name;
        const artists = await User.find({ name: { $regex: query, $options: 'i' }, userType: "artist" }).select('_id');

        const artistIds = artists.map(artist => artist._id);
        const albums = await Album.find({ artistId: { $in: artistIds } });
        res.json(albums);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}
export default (app) => {
    app.post('/api/albums/:userId', createAlbum);
    app.get('/api/albums', findAlbums);
    app.get('/api/albums/sorted', getAllSortedAlbums);
    app.get('/api/albums/user/:userId', getAllAlbums);
    app.get('/api/albums/search', searchAlbumByName);



    app.get('/api/albums/:id', getAlbumById);
    app.get('/api/albums/songs/:id', getAlbumSongsById);
    // app.get('/api/albums/local/:id', albumInLocal);

    app.put('/api/albums/:id', updateAlbum);
    app.delete('/api/albums/:id', deleteAlbum);
}
