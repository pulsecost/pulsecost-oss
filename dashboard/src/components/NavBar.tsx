import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar: React.FC = () => {
  return (
    <nav
      style={{
        backgroundColor: '#f8f9fa',
        padding: '1rem',
        borderBottom: '1px solid #dee2e6',
        marginBottom: '2rem',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          gap: '2rem',
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#495057' }}>
          OptiLM Dashboard
        </h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <NavLink
            to="/"
            style={({ isActive }) => ({
              padding: '0.5rem 1rem',
              textDecoration: 'none',
              color: isActive ? '#007bff' : '#6c757d',
              fontWeight: isActive ? 'bold' : 'normal',
              borderBottom: isActive
                ? '2px solid #007bff'
                : '2px solid transparent',
            })}
          >
            Home
          </NavLink>
          <NavLink
            to="/logs"
            style={({ isActive }) => ({
              padding: '0.5rem 1rem',
              textDecoration: 'none',
              color: isActive ? '#007bff' : '#6c757d',
              fontWeight: isActive ? 'bold' : 'normal',
              borderBottom: isActive
                ? '2px solid #007bff'
                : '2px solid transparent',
            })}
          >
            Logs
          </NavLink>
          <NavLink
            to="/config"
            style={({ isActive }) => ({
              padding: '0.5rem 1rem',
              textDecoration: 'none',
              color: isActive ? '#007bff' : '#6c757d',
              fontWeight: isActive ? 'bold' : 'normal',
              borderBottom: isActive
                ? '2px solid #007bff'
                : '2px solid transparent',
            })}
          >
            Config
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
