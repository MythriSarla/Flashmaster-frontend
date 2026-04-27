import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login      from './pages/Login';
import Register   from './pages/Register';
import Dashboard  from './pages/Dashboard';
import Flashcards from './pages/Flashcards';
import Materials  from './pages/Materials';
import StudyPlan  from './pages/StudyPlan';
import Progress   from './pages/Progress';

const isLoggedIn = () => !!localStorage.getItem('token');

function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Navigate to="/dashboard" />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/dashboard"   element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/materials"   element={<PrivateRoute><Materials /></PrivateRoute>} />
        <Route path="/flashcards"  element={<PrivateRoute><Flashcards /></PrivateRoute>} />
        <Route path="/plan"        element={<PrivateRoute><StudyPlan /></PrivateRoute>} />
        <Route path="/progress"    element={<PrivateRoute><Progress /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
