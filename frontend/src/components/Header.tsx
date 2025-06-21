import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './Header.css';

export default function Header() {
  const { token, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="header-left">
        <span className="logo">Fitness Trainer</span>
      </div>

      {token && (
        <nav className="header-nav">
          <NavLink
            to="/trainings"
            className={({ isActive }) =>
              isActive ? 'tab tab-active' : 'tab'
            }
          >
            Treningi
          </NavLink>

          <NavLink
            to="/stats"
            className={({ isActive }) =>
              isActive ? 'tab tab-active' : 'tab'
            }
          >
            Statystyki
          </NavLink>

          <NavLink
            to="/calendar"
            className={({ isActive }) =>
              isActive ? 'tab tab-active' : 'tab'
            }
          >
            Kalendarz
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? 'tab tab-active' : 'tab'
            }
          >
            Profil
          </NavLink>

          <button onClick={logout} className="btn-logout">
            Wyloguj
          </button>
        </nav>
      )}
    </header>
  );
}
