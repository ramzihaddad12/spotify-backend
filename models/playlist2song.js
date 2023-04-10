import mongoose from 'mongoose';

// Define the like schema for the relationship between users and songs
const playlist2songSchema = new mongoose.Schema({
    playlist: {
        type: String,
        ref: 'Playlist',
        required: true
    },
    song: {
        type: String,
        ref: 'Song',
        required: true
    }
});

const Playlist2Song = mongoose.model('Playlist2Song', playlist2songSchema);
export default Playlist2Song;