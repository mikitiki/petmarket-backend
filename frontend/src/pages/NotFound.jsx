import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '5rem', fontWeight: '800', color: 'var(--accent)', marginBottom: '1rem', margin: 0 }}>
          404
        </h1>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.875rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
          Strona nie istnieje
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '28rem', margin: '0 auto 2rem' }}>
          Przepraszamy, ale strona której szukasz nie została znaleziona.
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--accent)',
            color: '#0f0f0f',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            textDecoration: 'none',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Home size={20} />
          Wróć do strony głównej
        </Link>
      </div>
    </div>
  );
};

export default NotFound;