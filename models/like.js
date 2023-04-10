import mongoose from 'mongoose';

// Define the like schema for the relationship between users and songs
const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    song: {
        type: String,
        ref: 'Song',
        required: true
    },
    likedAt: {
        type: Date,
        default: Date.now
    }
});

const Like = mongoose.model('Like', likeSchema);
export default Like;