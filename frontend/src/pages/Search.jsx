import React, { useState, useEffect } from 'react';
import { getSpecialists } from '../services/api';
import SpecialistCard from '../components/SpecialistCard';
import { Search as SearchIcon, AlertCircle } from 'lucide-react';

const Search = () => {
  const [city, setCity] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSpecialists = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getSpecialists({ city, specialization: specialization || undefined });
      setSpecialists(data);
    } catch (err) {
      setError('Nie udało się wczytać specjalistów');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialists();
  }, []);

  const handleFilterChange = () => {
    fetchSpecialists();
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: 'calc(100vh - 80px)', padding: '2rem' }}>
      <div className="max-w-6xl mx-auto px-6">
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
          Znajdź Specjalistów
        </h1>

        {/* Filter Bar */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', '@media (min-width: 768px)': { flexDirection: 'row' } }}>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Miasto"
              style={{
                flex: 1,
                backgroundColor: '#1a1a1a',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            />
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            >
              <option value="">Wszystkie specjalizacje</option>
              <option value="Weterynarz">Weterynarz</option>
              <option value="Behawiorysta">Behawiorysta</option>
              <option value="Groomer">Groomer</option>
              <option value="Inny">Inny</option>
            </select>
            <button
              onClick={handleFilterChange}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--accent)',
                color: '#0f0f0f',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: 'none',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = 'var(--accent-hover)')}
              onMouseOut={(e) => (e.target.style.backgroundColor = 'var(--accent)')}
            >
              <SearchIcon size={20} />
              Szukaj
            </button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  border: '1px solid var(--border)',
                  animation: 'pulse 2s infinite',
                  opacity: 0.5,
                }}
              >
                <div
                  style={{
                    width: '4rem',
                    height: '4rem',
                    backgroundColor: 'var(--border)',
                    borderRadius: '50%',
                    marginBottom: '1rem',
                  }}
                ></div>
                <div style={{ height: '1rem', backgroundColor: 'var(--border)', borderRadius: '0.25rem', marginBottom: '0.5rem' }}></div>
                <div style={{ height: '1rem', backgroundColor: 'var(--border)', borderRadius: '0.25rem' }}></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', backgroundColor: 'rgba(220, 38, 38, 0.1)', borderRadius: '0.75rem', color: '#fca5a5', textAlign: 'center' }}>
            <AlertCircle size={20} />
            {error}
          </div>
        ) : specialists.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>Brak wyników</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialists.map((specialist) => (
              <SpecialistCard key={specialist.id} {...specialist} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;