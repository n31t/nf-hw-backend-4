import mongoose from "mongoose";
import { ObjectId } from "mongoose";
import Joi from "joi";

export interface ISong extends mongoose.Document {
    name: string;
    artist: ObjectId;
    song: string;
    img: string;
    url: string;
} 

const SongSchema = new mongoose.Schema({
    name: { type: String, required: true },
    artist: { type: mongoose.Schema.Types.ObjectId, required: true },
    song: { type: String, required: true },
    img: { type: String, required: true },
    url: { type: String, required: true },
})


export default mongoose.model<ISong>('Song', SongSchema)
