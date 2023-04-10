import mongoose from 'mongoose';

// Define the like schema for the relationship between users and songs
const followSchema = new mongoose.Schema({
    user: {
        type: String,
        ref: 'User',
        required: true
    },
    following: {
        type: String,
        ref: 'User',
        required: true
    }
});

const Follow = mongoose.model('Follow', followSchema);
export default Follow;