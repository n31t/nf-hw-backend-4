import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "./Profile.css";

export const Profile = () => {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token') || "";
    setToken(storedToken);
    const storedAvatar = localStorage.getItem('avatar') || "";
    setAvatar(storedAvatar);
    const storedUserId = localStorage.getItem('id') || "";
    setUserId(storedUserId);
    const storedUsername = localStorage.getItem('username') || "";
    setUsername(storedUsername);
  
    console.log('Token:', storedToken);
    console.log('Avatar:', storedAvatar);
    console.log('User ID:', storedUserId);
    console.log('Username:', storedUsername);
  }, []);

  const handleFileChange = (event) => {
    if (event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile("");
    }
  };

  const handleSubmit = async (event) => {
    setIsLoading(true);
    setUserId(localStorage.getItem('id'));
    event.preventDefault();
    try {
      // Update username
      const usernameResponse = await axios.put(`https://nf-hw-backend-4-xm1l.onrender.com/api/v5/auth/users/${userId}/username`, {
        username
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      console.log('Username updated successfully');
      console.log(usernameResponse.data);
  
      // Update avatar
      if (selectedFile) {
        const formData = new FormData();
        formData.append('avatar', selectedFile);
    
        const avatarResponse = await axios.put(`https://nf-hw-backend-4-xm1l.onrender.com/api/v5/auth/users/${userId}/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
    
        console.log('Avatar updated successfully');
        console.log(avatarResponse.data);
        localStorage.setItem('avatar', avatarResponse.data.avatar);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false); // set loading state to false when upload finishes
    }
  };

  return (
    <div className="min-h-screen text-gray-300">
      <Header setShowSidebar={setShowSidebar} />
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <div className="bg-custom-section pt-28 md:pl-72 p-8 min-h-screen">
        <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6">Profile</h1>
          {isLoading ? (
            <div>Loading...</div> // replace this with your loading spinner or indicator
          ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Avatar:</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-3 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring 
                focus:border-blue-300 bg-white"
              />
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-green-600 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Update Profile
            </button>
          </form>
          )}
        </div>
      </div>
    </div>
  );
};
