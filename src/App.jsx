import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Kuis from './pages/Kuis';
import Login from './pages/Login';
import GameHub from './pages/GameHub';
import GamePetaButa from './pages/GamePetaButa';
import GameDetektif from './pages/GameDetektif';
import GamePetualangan from './pages/GamePetualangan';
import GameBudaya from './pages/GameBudaya';

export default function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/kuis" element={<Kuis />} />
        <Route path="/login" element={<Login />} />
          <Route path="/game" element={<GameHub />} />
  <Route path="/game/peta-buta" element={<GamePetaButa />} />
  <Route path="/game/detektif" element={<GameDetektif />} />
  <Route path="/game/petualangan" element={<GamePetualangan />} />
  <Route path="/game/budaya" element={<GameBudaya />} />
      </Routes>
    </Router>
  );
}