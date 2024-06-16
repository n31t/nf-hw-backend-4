import Joi from "joi";
import mongoose, { ObjectId } from "mongoose";

export interface IPlaylist extends mongoose.Document {
    name: string;
    user: ObjectId;
    description: string;
    songs: ObjectId[];
    img: string;
}

const PlaylistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song', default: [] }],
    img : { type: String }
})



export default mongoose.model<IPlaylist>('Playlist', PlaylistSchema)

