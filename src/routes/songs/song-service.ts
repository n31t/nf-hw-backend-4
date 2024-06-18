import Song, {ISong} from './models/Song';

class SongService {
  async createSong(song: ISong): Promise<ISong> {
    const newSong = new Song(song);
    await newSong.save();
    return newSong;
  }

  async getSong(id: string): Promise<ISong | null> {
    return await Song.findById(id).exec();
  }

  async getAllSongs(): Promise<ISong[]> {
    return await Song.find({}).exec();
  }

  async updateSong(id: string, song: Partial<ISong>): Promise<ISong | null> {
    return await Song.findByIdAndUpdate(id, song, { new: true }).exec();
  }

  async deleteSong(id: string): Promise<void> {
    await Song.findByIdAndDelete(id).exec();
    return;
  }

  async updateSongUrl(id: string, url: string): Promise<ISong | null> {
    const song = await Song.findById(id);
    if (!song) {
      return null;
    }
    song.url = url;
    await song.save();
    return song;
  }

    async updateSongImageUrl(id: string, img: string): Promise<ISong | null> {
        const song = await Song.findById(id);
        if (!song) {
            return null;
        }
        song.img = img;
        await song.save();
        return song;
    }

    async searchSongsByKeywords(keywords: string): Promise<ISong[]> {
      const keywordArray = keywords.split(' ');
      const queryArray = keywordArray
      .map(keyword => ({ name: { $regex: keyword, $options: 'i' } }));
      return await Song.find({ $or: queryArray }).exec();
    }
}

export default SongService;