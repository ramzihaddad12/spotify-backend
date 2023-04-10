import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema({
    name: String,
    artistId: String,
    images: [{url: String}]
},  {
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

albumSchema.virtual('id').get(function() {
    return this._id.toHexString();
});
const Album = mongoose.model('Album', albumSchema);
export default Album