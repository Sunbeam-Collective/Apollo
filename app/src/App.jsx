import { Routes, Route } from "react-router-dom";
import { useState, useRef, createContext } from "react";

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
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </SongContextProvider>
    </>
  );
}

export default App;
