import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Layout() {
  const { logout } = useAuth();
  const nav = useNavigate();
  const tabs = [
    { to: '/trainings', label: 'Treningi' },
    { to: '/stats',      label: 'Statystyki' },
    { to: '/calendar',   label: 'Kalendarz' },
    { to: '/profile',    label: 'Profil' },
  ];

  return (
    <>
      <header style={{
        background: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '0.5em 1em'
      }}>
        <div className="container" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <h1 style={{ fontSize: '1.25rem' }}>Fitness Trainer</h1>
          <nav style={{ display: 'flex', gap: '0.5em' }}>
            {tabs.map(tab => (
              <NavLink
                key={tab.to}
                to={tab.to}
                style={({ isActive }) => ({
                  padding: '0.5em 1em',
                  borderRadius: 'var(--radius)',
                  background: isActive ? 'var(--color-main)' : 'transparent',
                  color: isActive ? 'white' : 'var(--color-main)',
                  textDecoration: 'none',
                  boxShadow: isActive ? 'var(--shadow)' : 'none'
                })}
              >
                {tab.label}
              </NavLink>
            ))}
            <button
              onClick={() => { logout(); nav('/login'); }}
              style={{
                background: 'var(--color-accent)',
                color: 'white',
                marginLeft: '1em'
              }}
            >
              Wyloguj
            </button>
          </nav>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
