import { Routes, Route } from "react-router-dom";
import {
  useState,
  useRef,
  createContext
} from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
// import "./App.css";

import {
  Playground,
  NotFoundPage,
  Auth,
  Home,
  Mixer,
  Player,
  Redirect,
} from "./pages";

import {
  SongContextProvider
} from './context'
import { SoundTest } from "./components";



function App() {
  return (
    <>
      <SongContextProvider>
        <Routes>
          <Route path="/playground" element={<Playground />} />
          <Route path="/" element={<Redirect />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/home" element={<Home />} />
          <Route path="/player/:id" element={<Player />} />
          <Route path="/mixer/:id" element={<Mixer />} />
          <Route path="test" element={<SoundTest />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </SongContextProvider>
    </>
  );
}

export default App;
