import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
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

function App() {
  return (
    <>
      <Routes>
        <Route path="/playground" element={<Playground />} />
        <Route path="/" element={<Redirect />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/mixer/:id" element={<Mixer />} />
        <Route path="/player/:id" element={<Player />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
