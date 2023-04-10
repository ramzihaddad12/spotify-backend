import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
    name: String,
    duration_ms: Number,
    albumId: String,
    artists: [{name: String}],
    album: {images: [{url: String}]}
}, {
    // Add the option to include the `id` field in the output
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    },
    toObject: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

songSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

const Song = mongoose.model('Song', songSchema);

export default Song