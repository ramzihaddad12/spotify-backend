import bcrypt from 'bcrypt';
import User from '../../models/user.js';
import Like from "../../models/like.js";
import Follow from "../../models/follow.js";
const logInUser = async (req, res) => {
    try {
        // Find user in the database
        const user = await User.findOne({ email: req.body.email });

        // If user not found, send error response
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare password with hashed password in the database
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

        // If password is invalid, send error response
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        else {
            req.session['profile'] = user;
            req.session.save();
            res.json(user);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getProfile = async (req, res) => {
    res.json(req.session['profile']);
}
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

const signUp = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            res.status(403).send('User already exists');;
            return;
        }

        else {
            // encrypt password
            const saltRounds = 10;
            req.body.password = await bcrypt.hash(req.body.password, saltRounds);

            // insert to db
            const user = new User(req.body);
            await user.save();
            res.status(201).json(user);

            // sessionize
            req.session["profile"] = user;
            req.session.save();
        }

    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

const logOutUser = async (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
}

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        res.status(200).send('User deleted');

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

const updateUser = async (req, res) => {
    console.log("UPDATING USERRRRRR");
    console.log(req.body);
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        console.log('updated user');
        console.log(user)
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).json(user);
        req.session["profile"] = user;
        req.session.save();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

const likeSong = async (req, res) => {
    console.log("req.params.userId");
    console.log(req.params.userId);
    try {
        const user = await User.findById(req.params.userId);
        if (req.session["profile"]._id != req.params.userId) {
            res.status(401).json({ message: 'User not logged in' });
        }

        if (!user) {
            res.status(401).json({ message: 'User does not exist' });
        }

        const likeExists = await Like.findOne({ user: req.params.userId, song: req.body.songId });

        if (likeExists) {
            // Unlike
            const result = await Like.deleteOne({ user: req.params.userId, song: req.body.songId });
        } else {
            const like = new Like({ user: req.params.userId, song: req.body.songId });
            await like.save();
        }

        req.session["profile"] = user;
        req.session.save();

        res.sendStatus(200);
    } catch (err) {
        console.error(err);
    }
}

const checkIfUserLikedSong = async (req, res) => {
    const like = await Like.findOne({ user: req.params.userId, song: req.params.songId });

    if (like) {
        console.log(req.params.songId);
        res.send({ message: true });
    } else {
        // The user did not like the song
        res.send({ message: false });
    }
}

const getLikedSongsForUser = async (req, res) => {
    if (req.params.userId === undefined) {
        console.log("here")
        res.json([]);
    }
    const likedSongs = await Like.find({ user: req.params.userId });
    const likedSongIds = likedSongs.map((like) => like.song.toString());

    console.log(likedSongIds);

    res.json(likedSongIds);

}

const getFollowingForUser = async (req, res) => {
    console.log("getFollowingForUser")

    if (req.params.userId === undefined) {
        console.log("here")
        res.json([]);
    }
    const following = await Follow.find({ user: req.params.userId });
    console.log("following");
    console.log(following);
    const result = following.map((fol) => fol.following.toString());

    console.log(result);

    res.json(result);

}

const getFollowersForUser = async (req, res) => {
    console.log("getFollowersForUser")

    if (req.params.userId === undefined) {
        console.log("here")
        res.json([]);
    }
    const followers = await Follow.find({ following: req.params.userId });
    console.log("followers");
    console.log(followers);
    const result = followers.map((fol) => fol.user.toString());

    console.log(result);

    res.json(result);

}


const followUser = async (req, res) => {
    console.log("req.params.userId");
    console.log(req.params.userId);
    try {
        const user = await User.findById(req.params.userId);
        if (req.session["profile"]._id != req.params.userId) {
            res.status(401).json({ message: 'User not logged in' });
        }

        if (!user) {
            res.status(401).json({ message: 'User does not exist' });
        }

        const followExists = await Follow.findOne({ user: req.params.userId, following: req.body.followId });

        if (followExists) {
            // Unlike
            const result = await Follow.deleteOne({ user: req.params.userId, following: req.body.followId });
        } else {
            const follow = new Follow({ user: req.params.userId, following: req.body.followId });
            await follow.save();
        }

        req.session["profile"] = user;
        req.session.save();

        res.sendStatus(200);
    } catch (err) {
        console.error(err);
    }
}

const checkFollow = async (req, res) => {
    console.log("checkFollow")
    const follow = await Follow.findOne({ user: req.params.userId, following: req.params.followId });

    if (follow) {
        res.send({ message: true });
    } else {
        // The user did not follow followId
        res.send({ message: false });
    }
}


const getNumberOfLikesForSong = async (req, res) => {
    const likeCount = await Like.countDocuments({ song: req.params.songId });

    console.log("likeCount");

    console.log(likeCount);

    res.json(likeCount);

}

const UserController = (app) => {
    app.post('/api/users/signup', signUp);
    app.get('/api/users/profile', getProfile);
    app.post('/api/users/login', logInUser);
    app.get('/api/users/logout', logOutUser);

    app.post('/api/users/:userId/likeSong', likeSong);
    app.get('/api/users/:userId/checkLike/:songId', checkIfUserLikedSong);
    app.get('/api/users/:userId/likedSongs', getLikedSongsForUser);
    app.get('/api/likes/:songId/numOflikes', getNumberOfLikesForSong);

    app.post('/api/users/:userId/follow', followUser);
    app.get('/api/users/:userId/checkFollow/:followId', checkFollow);
    app.get('/api/users/following/:userId', getFollowingForUser);
    app.get('/api/users/followers/:userId', getFollowersForUser);


    app.get('/api/users', getAllUsers)
    app.get('/api/users/get/:id', getUserById);
    app.delete('/api/users/:id', deleteUser);
    app.put('/api/users/update/:id', updateUser);
}
export default UserController