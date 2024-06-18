import { Request, Response } from 'express';
import SongService from './song-service';
import { ISong } from './models/Song';
import Busboy from 'busboy';
import { uploadFile } from '../../middlewares/s3-middleware';
// import { listBuckets } from '../../middlewares/s3-middleware';
// import { putFile } from '../../middlewares/s3-middleware';
// import { uploadFile } from '../../middlewares/s3-middleware';
// import { deleteFile } from '../../middlewares/s3-middleware';
// import multer from 'multer';


class SongController {
  private songService: SongService;

  constructor(songService: SongService) {
    this.songService = songService;
  }

  createSong = async (req: Request, res: Response): Promise<void> => {
    try {
      const song: ISong = req.body;
      const newSong = await this.songService.createSong(song);
        res.status(201).json(newSong);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }

  uploadSong = async (req: Request, res: Response): Promise<void> => {
    try{
        const { id } = req.params;
        const busboy = new Busboy({ headers: req.headers});

        busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
            const url = await uploadFile('nf-spotify-hw', filename, file);
            console.log('File uploaded successfully');
            const updatedSong = await this.songService.updateSongUrl(id, url);

            if (!updatedSong) {
              res.status(404).json({ message: 'Song not found' });
              return;
            }
      
            res.status(201).json({ message: 'File uploaded successfully', song: updatedSong })
        });
        return req.pipe(busboy);
    }
    catch (error: any) {
        res.status(500).send({ error: error.message });
    }
  }

    uploadSongImage = async (req: Request, res: Response): Promise<void> => {
    try{
        const { id } = req.params;
        const busboy = new Busboy({ headers: req.headers});

        busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
            const url = await uploadFile('nf-spotify-hw', filename, file);
            console.log('File uploaded successfully');
            const updatedSong = await this.songService.updateSongImageUrl(id, url);

            if (!updatedSong) {
              res.status(404).json({ message: 'Song not found' });
              return;
            }
      
            res.status(201).json({ message: 'File uploaded successfully', song: updatedSong })
        });
        return req.pipe(busboy);
    }
    catch (error: any) {
        res.status(500).send({ error: error.message });
    }
  }
  getSongs = async (req: Request, res: Response): Promise<void> => {
    try {
      const songs = await this.songService.getAllSongs();
      res.status(200).json(songs);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }

  getSongById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const song = await this.songService.getSong(id);
      if (!song) {
        res.status(404).json({ message: 'Song not found' });
        return;
      }
      res.status(200).json(song);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }

  updateSong = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const songUpdate: Partial<ISong> = req.body;
      const song = await this.songService.updateSong(id, songUpdate);
      if (!song) {
        res.status(404).json({ message: 'Song not found' });
        return;
      }
      res.status(200).json(song);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }

  deleteSong = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.songService.deleteSong(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }

  searchSongs = async (req: Request, res: Response): Promise<void> => {
    try {
      const { keywords } = req.body;
      if (!keywords) {
        res.status(400).json({ message: 'No keywords provided' });
        return;
      }
      const songs = await this.songService.searchSongsByKeywords(keywords as string);
      res.status(200).json(songs);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }
}

export default SongController;