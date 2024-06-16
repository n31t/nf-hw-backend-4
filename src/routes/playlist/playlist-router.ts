import { Router } from "express";
import PlaylistService from "./playlist-service";
import PlaylistController from "./playlist-controller";
import { authMiddleware } from "../../middlewares/auth-middleware";

const playlistRouter = Router();
const playlistService = new PlaylistService();
const playlistController = new PlaylistController(playlistService);

playlistRouter.post('/', authMiddleware, playlistController.createPlaylist);
playlistRouter.get('/', playlistController.getPlaylists);
playlistRouter.get('/:id', playlistController.getPlaylistById);
playlistRouter.put('/:id', authMiddleware, playlistController.updatePlaylist);
playlistRouter.delete('/:id', authMiddleware, playlistController.deletePlaylist);
playlistRouter.post('/:id/song', authMiddleware, playlistController.addSongToPlaylist);
playlistRouter.delete('/:id/song', authMiddleware, playlistController.removeSongFromPlaylist);

export default playlistRouter;