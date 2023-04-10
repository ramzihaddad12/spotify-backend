import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    userType: String,
    month: String,
    year: String,
    date: String,
    gender: String,
});

const User = mongoose.model('User', userSchema);

export default User