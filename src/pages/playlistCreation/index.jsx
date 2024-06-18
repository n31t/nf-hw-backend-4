import React, { useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { useEffect } from "react";

export const CreatePlaylist = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [img, setImg] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');
  const [user, setUser] = useState('');

  useEffect(() => {
    setToken(localStorage.getItem('token') || '');
    setUser(localStorage.getItem('id') || '');
  }, []);
  
  const handleFileChange = (event) => {
    setImg(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    console.log('Token:', token);
    console.log('User:', user);

    try {
      const playlistData = {
        name,
        description,
        user,
        songs: [],
        img: ''
      };

      const response = await axios.post('https://nf-hw-backend-4-xm1l.onrender.com/api/v5/playlists', playlistData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Playlist created successfully:', response.data);

      if (img) {
        const imageFormData = new FormData();
        imageFormData.append('image', img);

        const imageResponse = await axios.post(`https://nf-hw-backend-4-xm1l.onrender.com/api/v5/playlists/${response.data._id}/upload-image`, imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });

        console.log('Image uploaded successfully:', imageResponse.data);
      }

    } catch (error) {
      console.error('Error creating playlist:', error);
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
          <h1 className="text-3xl font-bold mb-6">Create Playlist</h1>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
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
                <label className="block text-sm font-medium mb-2">Description:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Image:</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full p-3 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 bg-white"
                />
              </div>
              <button
                type="submit"
                className="w-full p-3 bg-green-600 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Create Playlist
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};