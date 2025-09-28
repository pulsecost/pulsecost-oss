import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const CommunityLayout: React.FC = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: '📊',
      current: location.pathname === '/',
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: '📈',
      current: location.pathname === '/analytics',
    },
    {
      name: 'Activity',
      href: '/logs',
      icon: '📄',
      current: location.pathname === '/logs',
    },
    {
      name: 'API Keys',
      href: '/api-keys',
      icon: '🔑',
      current: location.pathname === '/api-keys',
    },
    {
      name: 'Settings',
      href: '/config',
      icon: '⚙️',
      current: location.pathname === '/config',
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        color: '#1F2937',
        display: 'flex',
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? '280px' : '80px',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E5E7EB',
          transition: 'width 0.3s ease',
          position: 'fixed',
          height: '100vh',
          zIndex: 50,
          overflow: 'hidden',
          top: 0,
          left: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: '24px 20px',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              flexShrink: 0,
            }}
          >
            📊
          </div>
          {sidebarOpen && (
            <div>
              <h1
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#1F2937',
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                OptiLM
              </h1>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ padding: '20px 0' }}>
          {navigationItems.map(item => (
            <NavLink
              key={item.name}
              to={item.href}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                margin: '4px 12px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                color: isActive ? '#FFFFFF' : '#6B7280',
                backgroundColor: isActive ? '#3B82F6' : 'transparent',
                transition: 'all 0.2s ease',
                border: isActive
                  ? '1px solid #3B82F6'
                  : '1px solid transparent',
              })}
            >
              <span style={{ fontSize: '18px', minWidth: '20px' }}>
                {item.icon}
              </span>
              {sidebarOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Toggle */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            right: '20px',
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#F3F4F6',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              color: '#6B7280',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#E5E7EB';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#F3F4F6';
            }}
          >
            <span>{sidebarOpen ? '←' : '→'}</span>
            {sidebarOpen && <span>Collapse</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          marginLeft: sidebarOpen ? '280px' : '80px',
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
          position: 'relative',
          zIndex: 1,
          width: sidebarOpen ? 'calc(100vw - 280px)' : 'calc(100vw - 80px)',
          maxWidth: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Main Content Area */}
        <main
          style={{
            padding: '32px',
            backgroundColor: '#F8FAFC',
            minHeight: '100vh',
            position: 'relative',
            zIndex: 1,
            overflow: 'hidden',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CommunityLayout;
