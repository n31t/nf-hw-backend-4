import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";

export const UserPage = () => {
  const { id: userId } = useParams();
  const [user, setUser] = useState(null);
  const [songs, setSongs] = useState([]);
  const [token, setToken] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem('token') || '');
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userResponse = await axios.get(`https://nf-hw-backend-4-xm1l.onrender.com/api/v5/auth/users/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (userResponse.data) {
        setUser(userResponse.data);
        fetchUserSongs(userResponse.data._id);
      } else {
        setError('User not found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Error fetching user data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserSongs = async (userId) => {
    try {
      const songsResponse = await axios.get(`https://nf-hw-backend-4-xm1l.onrender.com/api/v5/songs`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const userSongs = songsResponse.data.filter(song => song.artist === userId);
      setSongs(userSongs);
    } catch (error) {
      console.error('Error fetching user songs:', error);
    }
  };

  return (
    <div className="min-h-screen text-gray-300">
      <Header setShowSidebar={setShowSidebar} />
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <div className="bg-custom-section pt-28 md:pl-72 p-8 min-h-screen">
        <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <>
              {user && (
                <div className="flex items-center mb-6">
                  <img src={user.avatar} alt={user.username} className="w-32 h-32 rounded-full mr-6" />
                  <div>
                    <h1 className="text-3xl font-bold">{user.username}</h1>
                    <p className="text-gray-400">{user.email}</p>
                  </div>
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold mb-4">Songs by {user ? user.username : 'User'}</h2>
                <ul>
                  {songs.map((song) => (
                    <li key={song._id} className="mb-4">
                      <h3 className="text-xl mb-2">{song.name}</h3>
                      <img src={song.img} alt={song.name} className="w-1/4 mb-2" />
                      <audio controls className="w-full">
                        <source src={song.url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
