import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { PlaylistsCard } from "../PlaylistCard";

export const Playlistsection = ({ title }) => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const response = await axios.get('http://localhost:3000/api/v5/playlists');
      setPlaylists(response.data);
    };

    fetchPlaylists();
  }, []);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-8">
        <Link to="/" className="text-2xl font-bold text-white hover:underline">
          Твои лучшие миксы
        </Link>
        <Link
          to="/"
          className="text-sm font-bold tracking-[2px] hover:underline"
        >
          Show all
        </Link>
      </div>
      <div className="horizontal-scroll grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {playlists.map((playlist, index) => (
          <PlaylistsCard
            key={index}
            title={playlist.name}
            link={playlist._id.toString()} 
            description={playlist.description}
            imageUrl={playlist.img}
          />
        ))}
      </div>
    </div>
  );
};