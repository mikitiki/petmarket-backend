import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as apiRegister } from '../services/api';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

const inputStyle = {
  width: '100%',
  backgroundColor: '#1a1a1a',
  border: '1px solid var(--border)',
  color: 'var(--text-primary)',
  borderRadius: '0.5rem',
  padding: '0.75rem 1rem',
  boxSizing: 'border-box',
  fontSize: '1rem',
  transition: 'border-color 0.2s ease',
};

const RULES = [
  { id: 'length',  label: 'Co najmniej 8 znaków',      test: (p) => p.length >= 8 },
  { id: 'upper',   label: 'Co najmniej jedna wielka litera', test: (p) => /[A-Z]/.test(p) },
  { id: 'number',  label: 'Co najmniej jedna cyfra',    test: (p) => /[0-9]/.test(p) },
];

const getStrength = (password, passed) => {
  if (password.length === 0) return null;
  if (passed === 3) return { label: 'Silne', color: '#22c55e', width: '100%' };
  if (passed === 2) return { label: 'Średnie', color: '#f59e0b', width: '66%' };
  return { label: 'Słabe', color: '#ef4444', width: '33%' };
};

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('owner');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [touched, setTouched] = useState(false);
  const navigate = useNavigate();

  const ruleResults = useMemo(() => RULES.map((r) => ({ ...r, ok: r.test(password) })), [password]);
  const passedCount = ruleResults.filter((r) => r.ok).length;
  const strength = getStrength(password, passedCount);
  const isValid = passedCount === RULES.length;
  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    setError('');
    setSuccess('');

    if (!isValid) {
      setError('Hasło nie spełnia wymagań bezpieczeństwa.');
      return;
    }
    if (!passwordsMatch) {
      setError('Hasła nie są identyczne.');
      return;
    }

    try {
      await apiRegister(email, password, role);
      setSuccess('Rejestracja udana! Przekierowanie do logowania...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Rejestracja nie powiodła się. Spróbuj ponownie.');
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
          Zarejestruj się
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Email */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="twoj@email.com"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              required
            />
          </div>

          {/* Hasło */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>
              Hasło
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setTouched(true); }}
              placeholder="••••••••"
              style={{
                ...inputStyle,
                borderColor: touched && !isValid && password.length > 0 ? '#ef4444' : 'var(--border)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.target.style.borderColor = touched && !isValid && password.length > 0 ? '#ef4444' : 'var(--border)')}
              required
            />

            {/* Pasek siły */}
            {password.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Siła hasła</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: strength.color }}>{strength.label}</span>
                </div>
                <div style={{ height: '4px', backgroundColor: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: strength.width, backgroundColor: strength.color, borderRadius: '2px', transition: 'width 0.3s ease, background-color 0.3s ease' }} />
                </div>
              </div>
            )}

            {/* Checklist wymagań */}
            {touched && password.length > 0 && (
              <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {ruleResults.map((r) => (
                  <li key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: r.ok ? '#86efac' : '#fca5a5' }}>
                    {r.ok
                      ? <CheckCircle size={13} style={{ flexShrink: 0 }} />
                      : <X size={13} style={{ flexShrink: 0 }} />
                    }
                    {r.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Potwierdź hasło */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>
              Potwierdź hasło
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                ...inputStyle,
                borderColor: confirmPassword.length > 0 && !passwordsMatch ? '#ef4444' : 'var(--border)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.target.style.borderColor = confirmPassword.length > 0 && !passwordsMatch ? '#ef4444' : 'var(--border)')}
              required
            />
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p style={{ fontSize: '0.8rem', color: '#fca5a5', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <X size={13} /> Hasła nie są identyczne
              </p>
            )}
            {confirmPassword.length > 0 && passwordsMatch && isValid && (
              <p style={{ fontSize: '0.8rem', color: '#86efac', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle size={13} /> Hasła są zgodne
              </p>
            )}
          </div>

          {/* Rola */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>
              Rola
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              required
            >
              <option value="owner">Właściciel zwierzęcia</option>
              <option value="specialist">Specjalista</option>
            </select>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', backgroundColor: 'rgba(220, 38, 38, 0.1)', borderRadius: '0.5rem', color: '#fca5a5' }}>
              <AlertCircle size={18} />
              <span style={{ fontSize: '0.875rem' }}>{error}</span>
            </div>
          )}

          {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '0.5rem', color: '#86efac' }}>
              <CheckCircle size={18} />
              <span style={{ fontSize: '0.875rem' }}>{success}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={touched && (!isValid || !passwordsMatch)}
            style={{
              width: '100%',
              backgroundColor: touched && (!isValid || !passwordsMatch) ? 'var(--border)' : 'var(--accent)',
              color: '#0f0f0f',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              fontSize: '1rem',
              marginTop: '0.5rem',
              transition: 'all 0.2s ease',
              cursor: touched && (!isValid || !passwordsMatch) ? 'not-allowed' : 'pointer',
              border: 'none',
            }}
            onMouseOver={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = 'var(--accent-hover)'; }}
            onMouseOut={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = 'var(--accent)'; }}
          >
            Zarejestruj się
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
          Masz już konto?{' '}
          <Link to="/login" style={{ color: 'var(--accent)' }}>
            Zaloguj się
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
