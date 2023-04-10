import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
    name: String,
    description: String,
    userId: String, //owner
});
//, ref: 'Song'
const Playlist = mongoose.model('Playlist', playlistSchema);
export default Playlist