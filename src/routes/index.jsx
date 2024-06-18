import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/home";
import { Signup } from "../pages/signup";
import { Signin } from "../pages/singin";
import { Profile } from "../pages/profile";
import { CreatePlaylist } from "../pages/playlistCreation";
import { CreateSong } from "../pages/playlists/[id]";
import { UserPage } from "../pages/author/[id]";
import SongSearch from "../pages/search";
export const RouteList = () => {
  return (
    <Routes>
      <Route path="" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/create-playlist" element={<CreatePlaylist />} />
      <Route path="/playlists/:id" element={<CreateSong />} />
      <Route path="/users/:id" element={<UserPage />} />
      <Route path="/search" element={<SongSearch />} />
    </Routes>
  );
};
