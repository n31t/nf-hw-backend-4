import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth-middleware";
import SongController from "./song-controller";
import SongService from "./song-service";


const songRouter = Router();
const songService = new SongService();
const songController = new SongController(songService);

songRouter.post('/', authMiddleware, songController.createSong);
songRouter.get('/', songController.getSongs);
songRouter.get('/:id', songController.getSongById);
songRouter.put('/:id', authMiddleware, songController.updateSong);
songRouter.delete('/:id', authMiddleware, songController.deleteSong);
songRouter.post('/:id/upload', authMiddleware, songController.uploadSong);
songRouter.post('/:id/upload-image', authMiddleware, songController.uploadSongImage);

songRouter.post('/search/keywords', songController.searchSongs);

export default songRouter;