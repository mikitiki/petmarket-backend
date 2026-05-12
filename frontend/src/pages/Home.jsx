import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CalendarCheck, Heart, ArrowRight } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
            Znajdź specjalistę dla swojego pupila
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '36rem', margin: '0 auto 2rem' }}>
            Łatwo znajdź weterynarzy, behawiorystów, groomerów i innych specjalistów opieki nad zwierzętami w Twojej okolicy.
          </p>
          <button
            onClick={() => navigate('/search')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1.5rem',
              backgroundColor: 'var(--accent)',
              color: '#0f0f0f',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--accent-hover)';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'var(--accent)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            <Search size={20} />
            Szukaj specjalistów
          </button>
        </div>
      </div>

      {/* Steps Section */}
      <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '4rem 1.5rem' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '2.25rem', fontWeight: '700', textAlign: 'center', marginBottom: '3rem', color: 'var(--text-primary)' }}>
            Jak to działa?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1: Search */}
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '1rem', padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '4rem', height: '4rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Search size={32} style={{ color: 'var(--accent)' }} />
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Szukaj
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                Znajdź specjalistę w swojej okolicy według specjalizacji i miasta.
              </p>
            </div>

            {/* Step 2: Book */}
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '1rem', padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '4rem', height: '4rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <CalendarCheck size={32} style={{ color: 'var(--accent)' }} />
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Rezerwuj
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                Wybierz dogodny termin i zarezerwuj wizytę online.
              </p>
            </div>

            {/* Step 3: Enjoy */}
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '1rem', padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '4rem', height: '4rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Heart size={32} style={{ color: 'var(--accent)' }} />
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Ciesz się wizytą
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                Twój pupil otrzyma najlepszą opiekę od sprawdzonych specjalistów.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;