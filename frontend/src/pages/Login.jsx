import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { login as apiLogin } from '../services/api';
import { AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await apiLogin(email, password);
      login(data.token, { role: data.role, user_id: data.user_id });
      navigate('/dashboard');
    } catch (err) {
      setError('Nieprawidłowy email lub hasło');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '1rem', padding: '2.5rem', maxWidth: '28rem', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
            PetMarket
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Premium Pet Care Services
          </p>
        </div>

        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.5rem', fontWeight: '700', textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
          Zaloguj się
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="twoj@email.com"
              style={{
                width: '100%',
                backgroundColor: '#1a1a1a',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                boxSizing: 'border-box',
                fontSize: '1rem',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>
              Hasło
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                backgroundColor: '#1a1a1a',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                boxSizing: 'border-box',
                fontSize: '1rem',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              required
            />
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', backgroundColor: 'rgba(220, 38, 38, 0.1)', borderRadius: '0.5rem', color: '#fca5a5' }}>
              <AlertCircle size={18} />
              <span style={{ fontSize: '0.875rem' }}>{error}</span>
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: 'var(--accent)',
              color: '#0f0f0f',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              fontSize: '1rem',
              marginTop: '0.5rem',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = 'var(--accent-hover)')}
            onMouseOut={(e) => (e.target.style.backgroundColor = 'var(--accent)')}
          >
            Zaloguj
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
          Nie masz konta?{' '}
          <Link to="/register" style={{ color: 'var(--accent)' }}>
            Zarejestruj się
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;