import { useState, useEffect } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'

import Playground from './pages/Playground';
import NotFoundPage from './pages/NotFoundPage';

function App() {

  return (
    <>
      <div>
        <Routes>
          <Route path='/playground' element={<Playground />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App
