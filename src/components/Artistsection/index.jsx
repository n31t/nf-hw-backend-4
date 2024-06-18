import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArtistsCard } from "../ArtistsCard";
import "./Artistsection.css";

export const Artistsection = ({ title }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://nf-hw-backend-4-xm1l.onrender.com/api/v5/auth/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-8">
        <Link to="/" className="text-2xl font-bold text-white hover:underline">
          Popular artists
        </Link>
        <Link
          to="/"
          className="text-sm font-bold tracking-[2px] hover:underline"
        >
          Show all
        </Link>
      </div>
      <div className="horizontal-scroll grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {users.map((user, index) => (
          <ArtistsCard
            key={index}
            title={user.username} // replace with the actual property name for the user's name
            description={user.description} // replace with the actual property name for the user's description
            imageUrl={user.avatar} // replace with the actual property name for the user's avatar
            link={user._id}
          />
        ))}
      </div>
    </div>
  );
};