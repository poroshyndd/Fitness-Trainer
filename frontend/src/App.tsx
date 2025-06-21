import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import RequireAuth from './components/RequireAuth';

import Login from './pages/Login';
import Register from './pages/Register';
import Trainings from './pages/Trainings';
import StatsView from './pages/StatsView';
import CalendarView from './pages/CalendarView';
import Profile from './pages/Profile';

export default function App() {
  return (
    <>
      <Header />

      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<RequireAuth />}>
            <Route path="/trainings" element={<Trainings />} />
            <Route path="/stats" element={<StatsView />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}
