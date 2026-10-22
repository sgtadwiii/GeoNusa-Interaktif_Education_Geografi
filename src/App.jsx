import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Kuis from './pages/Kuis';
import Login from './pages/Login';

export default function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/kuis" element={<Kuis />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}