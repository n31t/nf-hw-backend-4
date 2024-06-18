import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import { useParams } from "react-router-dom";

export const CreateSong = () => {
  const { id: playlistId } = useParams();
  const [name, setName] = useState("");
  const [artist, setArtist] = useState('');
  const [url, setUrl] = useState('');
  const [img, setImg] = useState('');
  const [song, setSong] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem('token') || '');
    setArtist(localStorage.getItem('id') || '')
    fetchPlaylist();
  }, []);

  useEffect(() => {
    if (playlist) {
      fetchSongs();
    }
  }, [playlist]);

  const fetchPlaylist = async () => {
    try {
      const response = await axios.get(`http://nf-hw-backend-4-xm1l.onrender.com/api/v5/playlists/${playlistId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        setPlaylist(response.data);
      } else {
        setError('Playlist does not exist');
      }
    } catch (error) {
      console.error('Error fetching playlist:', error);
    }
  };

  const fetchSongs = async () => {
    try {
      const songPromises = playlist.songs.map(songId =>
        axios.get(`http://nf-hw-backend-4-xm1l.onrender.com/api/v5/songs/${songId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
      );
      const songResponses = await Promise.all(songPromises);
      const songDetails = songResponses.map(response => response.data);
      setSongs(songDetails);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.name === "img") {
      setImg(e.target.files[0]);
    } else if (e.target.name === "url") {
      setUrl(e.target.files[0]);
    }
  };

  const handleSubmit = async (event) => {
    console.log("Url", url)
    event.preventDefault();
    setIsLoading(true);

    try {
      const defaultImg = 'default_img_url'
      const defaultSong = 'default_song_url'
      const songData = {
        name,
        artist,
        img: defaultImg,
        song: 'song',
        url: defaultSong
      };

      const response = await axios.post(`http://nf-hw-backend-4-xm1l.onrender.com/api/v5/songs`, songData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const songId = response.data._id;

      if (img) {
        const imgFormData = new FormData();
        imgFormData.append('image', img);

        const imgUploadResponse = await axios.post(`http://nf-hw-backend-4-xm1l.onrender.com/api/v5/songs/${songId}/upload-image`, imgFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Image uploaded successfully:', imgUploadResponse.data);
      }

      if (url) {
        const songFormData = new FormData();
        songFormData.append('url', url);

        const songUploadResponse = await axios.post(`http://nf-hw-backend-4-xm1l.onrender.com/api/v5/songs/${songId}/upload`, songFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Song uploaded successfully:', songUploadResponse.data);
      }

      const playlistResponse = await axios.put(`http://nf-hw-backend-4-xm1l.onrender.com/api/v5/playlists/${playlistId}`, {
        songs: [...playlist.songs, songId],
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Song added to playlist successfully:', playlistResponse.data);
      fetchPlaylist(); // Refresh the playlist data after adding the song
    } catch (error) {
      console.error('Error creating song:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-gray-300">
      <Header setShowSidebar={setShowSidebar} />
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <div className="bg-custom-section pt-28 md:pl-72 p-8 min-h-screen">
        <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6">Playlist Details</h1>
          {error ? (
            <div>{error}</div>
          ) : isLoading ? (
            <div>Loading...</div>
          ) : (
            <div>
              {playlist && (
                <>
                  <h2 className="text-2xl mb-4">{playlist.name}</h2>
                  <p className="mb-4">{playlist.description}</p>
                  <img src={playlist.img} alt={playlist.name} className="w-1/2 mb-4 m-auto" />
                  <ul className="mb-6">
                  {songs.map((song, index) => (
                      <li key={index} className="mb-4">
                        <h3 className="text-xl mb-2">{song.name}</h3>
                        <img src={song.img} alt={song.name} className="w-1/4 mb-2" />
                        <audio controls className="w-full">
                          <source src={song.url} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </li>
                    ))}
                  </ul>
                  <h1 className="text-3xl font-bold mb-6">Add a New Song</h1>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Name:</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
                      />
                    </div>
  
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Image:</label>
                      <input
                        type="file"
                        name="img"
                        onChange={handleFileChange}
                        className="w-full p-3 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 bg-white"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Song File:</label>
                      <input
                        type="file"
                        name="url"
                        onChange={handleFileChange}
                        className="w-full p-3 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 bg-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full p-3 bg-green-600 rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                      Add Song
                    </button>
                  </form>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
