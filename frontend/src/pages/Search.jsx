import React, { useState, useEffect } from 'react';
import { getSpecialists } from '../services/api';
import SpecialistCard from '../components/SpecialistCard';
import { Search as SearchIcon, AlertCircle, RefreshCw } from 'lucide-react';

const POLISH_CITIES = [
  'Białystok', 'Bielsko-Biała', 'Bydgoszcz', 'Bytom', 'Chorzów',
  'Częstochowa', 'Gdańsk', 'Gdynia', 'Gliwice', 'Katowice',
  'Kielce', 'Kraków', 'Lublin', 'Łódź', 'Olsztyn',
  'Opole', 'Poznań', 'Radom', 'Ruda Śląska', 'Rybnik',
  'Rzeszów', 'Sosnowiec', 'Szczecin', 'Toruń', 'Tychy',
  'Warszawa', 'Włocławek', 'Wrocław', 'Zabrze', 'Zielona Góra',
];

const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

const inputStyle = {
  flex: 1,
  backgroundColor: '#1a1a1a',
  border: '1px solid var(--border)',
  color: 'var(--text-primary)',
  borderRadius: '0.5rem',
  padding: '0.75rem 1rem',
  fontSize: '1rem',
  transition: 'border-color 0.2s ease',
  minWidth: 0,
};

const Search = () => {
  const [city, setCity] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSpecialists = async (cityVal = city, specVal = specialization) => {
    setLoading(true);
    setError('');
    try {
      const data = await getSpecialists({
        city: capitalize(cityVal.trim()) || undefined,
        specialization: specVal || undefined,
      });
      setSpecialists(data);
    } catch {
      setError('Nie udało się połączyć z serwerem. Sprawdź czy backend jest uruchomiony.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialists('', '');
  }, []);

  const handleSearch = () => fetchSpecialists();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleReset = () => {
    setCity('');
    setSpecialization('');
    fetchSpecialists('', '');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: 'calc(100vh - 80px)', padding: '2rem' }}>
      <div className="max-w-6xl mx-auto px-6">
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
          Znajdź Specjalistów
        </h1>

        {/* Filter Bar */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>

            {/* City autocomplete */}
            <div style={{ flex: 1, minWidth: '160px', position: 'relative' }}>
              <input
                type="text"
                list="cities-list"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Miasto"
                autoComplete="off"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              />
              <datalist id="cities-list">
                {POLISH_CITIES.filter((c) =>
                  city.length === 0 || c.toLowerCase().startsWith(city.toLowerCase())
                ).map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            {/* Specialization select */}
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              style={{
                flex: 1,
                minWidth: '160px',
                backgroundColor: '#1a1a1a',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                cursor: 'pointer',
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

            {/* Search button */}
            <button
              onClick={handleSearch}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                backgroundColor: 'var(--accent)', color: '#0f0f0f',
                padding: '0.75rem 1.5rem', borderRadius: '0.5rem',
                fontWeight: '600', fontSize: '1rem', cursor: 'pointer', border: 'none',
                whiteSpace: 'nowrap',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-hover)')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent)')}
            >
              <SearchIcon size={18} />
              Szukaj
            </button>

            {/* Reset button — shows only when filters are active */}
            {(city || specialization) && (
              <button
                onClick={handleReset}
                style={{
                  backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)',
                  border: '1px solid var(--border)', padding: '0.75rem 1rem',
                  borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.9rem',
                  whiteSpace: 'nowrap',
                }}
              >
                Wyczyść
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ backgroundColor: 'var(--bg-card)', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid var(--border)', animation: 'pulse 2s infinite', opacity: 0.5 }}>
                <div style={{ width: '4rem', height: '4rem', backgroundColor: 'var(--border)', borderRadius: '50%', marginBottom: '1rem' }}></div>
                <div style={{ height: '1rem', backgroundColor: 'var(--border)', borderRadius: '0.25rem', marginBottom: '0.5rem' }}></div>
                <div style={{ height: '1rem', backgroundColor: 'var(--border)', borderRadius: '0.25rem' }}></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem', backgroundColor: 'rgba(220, 38, 38, 0.1)', borderRadius: '0.75rem', color: '#fca5a5', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={20} />
              {error}
            </div>
            <button
              onClick={() => fetchSpecialists('', '')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#fca5a5', border: '1px solid rgba(220, 38, 38, 0.3)', borderRadius: '0.5rem', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              <RefreshCw size={16} />
              Spróbuj ponownie
            </button>
          </div>
        ) : specialists.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Brak wyników dla podanych filtrów.</p>
            {(city || specialization) && (
              <button onClick={handleReset} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem' }}>
                Pokaż wszystkich specjalistów
              </button>
            )}
          </div>
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
