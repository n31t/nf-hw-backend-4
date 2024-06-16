import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  email: string
  username?: string
  password: string
  avatar?: string
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String },
  password: { type: String, required: true },
  avatar: { type: String }
})

export default mongoose.model<IUser>('User', UserSchema)
