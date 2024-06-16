import Playlist, { IPlaylist } from "./models/Playlist";
import mongoose, { ObjectId } from "mongoose";
import { PlaylistDto } from "./dtos/Playlist.dto";
import SongService from "../songs/song-service";

const songService = new SongService();

class PlaylistService {
    async createPlaylist(playlist: PlaylistDto): Promise<IPlaylist> {
        const newPlaylist = new Playlist(playlist);
        await newPlaylist.save();
        return newPlaylist;
    }

    async getPlaylist(id : string): Promise<IPlaylist | null> {
        const playlist = await Playlist.findById(id).exec();
        return playlist;
    }

    async getAllPlaylists(): Promise<IPlaylist[]> {
        return await Playlist.find({}).exec();
    }

    async updatePlaylist(id: string, playlist: Partial<PlaylistDto>): Promise<IPlaylist | null> {
        return await Playlist.findByIdAndUpdate(id, playlist, { new: true }).exec();
    }

    async deletePlaylist(id : string): Promise<void> {
        await Playlist.findByIdAndDelete(id).exec();
        return;
    }

    async addSongToPlaylist(playlistId: string, songId: string): Promise<IPlaylist | null> {
        const playlist = await Playlist.findById(playlistId).exec();
        if (!playlist) {
            throw new Error('Playlist not found');
        }

        const songObjectId = new mongoose.Types.ObjectId(songId);

        if (playlist.songs.map(song => song.toString()).includes(songObjectId.toString())) { 
            throw new Error('Song already exists in the playlist');
        }

        if (!await songService.getSong(songId)) {
            throw new Error('Song not found');
        }
        return await Playlist.findByIdAndUpdate(playlistId, { $push: { songs: new mongoose.Types.ObjectId(songId) } }, { new: true }).exec();
    }

    async removeSongFromPlaylist(playlistId: string, songId: string): Promise<IPlaylist | null> {
        const playlist = await Playlist.findById(playlistId).exec();
        if (!playlist) {
            throw new Error('Playlist not found');
        }

        const songObjectId = new mongoose.Types.ObjectId(songId);

        if (!playlist.songs.map(song => song.toString()).includes(songObjectId.toString())) { 
            throw new Error('Song does not exist in the playlist');
        }

        return await Playlist.findByIdAndUpdate(playlistId, { $pull: { songs: songObjectId } }, { new: true }).exec();
    }
}

export default PlaylistService;