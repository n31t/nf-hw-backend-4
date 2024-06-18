import React, { useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const SongSearch = () => {
  const [keywords, setKeywords] = useState('');
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

   const keywordsForm = {
        keywords
   }

    try {
    //   const response = await axios.post('http://localhost:3000/api/v5/songs/search/keywords', keywordsForm, {});
    //   setSongs(response.data);
    const [songsResponse, usersResponse] = await Promise.all([
        axios.post('https://nf-hw-backend-4-xm1l.onrender.com/api/v5/songs/search/keywords', keywordsForm, {
          headers: {
            'Content-Type': 'application/json',
          },
        }),
        axios.post('https://nf-hw-backend-4-xm1l.onrender.com/api/v5/auth/users/search/keywords', keywordsForm, {
          headers: {
            'Content-Type': 'application/json',
          },
        }),
    ]);
      setSongs(songsResponse.data);
      setUsers(usersResponse.data);
    } catch (error) {
      console.log(keywords)
      console.error('Error searching songs and users:', error);
      setError('Error searching songs and users');
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
          <h1 className="text-3xl font-bold mb-6">Search</h1>
          <form onSubmit={handleSearch} className="mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Keywords:</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full p-3 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-green-600 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Search
            </button>
          </form>
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4">Songs</h2>
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
              <h2 className="text-2xl font-bold mb-4">Users</h2>
              <ul>
                {users.map((user) => (
                <Link to={`/users/${user._id}`}>
                  <li key={user._id} className="mb-4 flex items-center">
                    <img src={user.avatar} alt={user.username} className="w-16 h-16 rounded-full mr-4" />
                    <div>
                      <h3 className="text-xl">{user.username}</h3>
                    </div>
                  </li>
                </Link>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


export default SongSearch;
