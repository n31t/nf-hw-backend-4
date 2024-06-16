import { PlaylistDto } from "./dtos/Playlist.dto";
import { IPlaylist } from "./models/Playlist";
import PlaylistService from "./playlist-service";
import { Request, Response } from 'express';
import { uploadFile } from "../../middlewares/s3-middleware";
import Busboy from 'busboy';

class PlaylistController {
  private playlistService: PlaylistService;

  constructor(playlistService: PlaylistService) {
    this.playlistService = playlistService;
  }

  createPlaylist = async (req: Request, res: Response): Promise<void> => {
    try {
      const playlist = req.body;
      const newPlaylist = await this.playlistService.createPlaylist(playlist);
      res.status(201).json(newPlaylist);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }

  getPlaylists = async (req: Request, res: Response): Promise<void> => {
    try {
      const playlists = await this.playlistService.getAllPlaylists();
      res.status(200).json(playlists);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }

  getPlaylistById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const playlist = await this.playlistService.getPlaylist(id);
      if (!playlist) {
        res.status(404).json({ message: 'Playlist not found' });
        return;
      }
      res.status(200).json(playlist);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }

  updatePlaylist = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const playlistUpdate: Partial<PlaylistDto> = req.body;
      const playlist = await this.playlistService.updatePlaylist(id, playlistUpdate);
      if (!playlist) {
        res.status(404).json({ message: 'Playlist not found' });
        return;
      }
      res.status(200).json(playlist);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }

  deletePlaylist = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.playlistService.deletePlaylist(id);
      res.status(200).json({ message: 'Playlist deleted' });
    } catch
    (error: any) {
      res.status(500).send({ error: error.message });
    }
  }

  addSongToPlaylist = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { songId } = req.body;
        if (!songId) {
            res.status(400).json({ message: 'No songId provided' });
            return;
        }
        const playlist = await this.playlistService.addSongToPlaylist(id, songId);
        res.status(200).json(playlist);
    } catch (error: any) {
        if (error.message === 'Playlist not found') {
            res.status(404).json({ message: 'Playlist not found' });
        } else if (error.message === 'Song already exists in the playlist') {
            res.status(400).json({ message: 'Song already exists in the playlist' });
        } else {
            res.status(500).send({ error: error.message });
        }
    }
}

  removeSongFromPlaylist = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { songId } = req.body;
        if (!songId) {
            res.status(400).json({ message: 'No songId provided' });
            return;
        }
        const playlist = await this.playlistService.removeSongFromPlaylist(id, songId);
        res.status(200).json(playlist);
    } catch (error: any) {
        if (error.message === 'Playlist not found') {
            res.status(404).json({ message: 'Playlist not found' });
        } else if (error.message === 'Song does not exist in the playlist') {
            res.status(400).json({ message: 'Song does not exist in the playlist' });
        } else {
            res.status(500).send({ error: error.message });
        }
    } 
    }

    uploadPlaylistImage = async (req: Request, res: Response): Promise<void> => {
        try{
            const { id } = req.params;
            const busboy = new Busboy({ headers: req.headers});
    
            busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
                const url = await uploadFile('nf-spotify-hw', filename, file);
                console.log('File uploaded successfully');
                const updatedPlaylist = await this.playlistService.updatePlaylistImg(id, url);
    
                if (!updatedPlaylist) {
                  res.status(404).json({ message: 'Playlist not found' });
                  return;
                }
                res.status(201).json({ message: 'File uploaded successfully', playlist: updatedPlaylist })
            });
            return req.pipe(busboy);
        }
        catch (error: any) {
            res.status(500).send({ error: error.message });
        }
      }
    
}

export default PlaylistController;