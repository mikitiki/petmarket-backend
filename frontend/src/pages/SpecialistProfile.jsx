import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSpecialistById, createBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, CheckCircle, User, Calendar } from 'lucide-react';

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
];

const todayDate = () => new Date().toISOString().split('T')[0];

const inputStyle = {
  width: '100%',
  backgroundColor: '#1a1a1a',
  border: '1px solid var(--border)',
  color: 'var(--text-primary)',
  borderRadius: '0.5rem',
  padding: '0.75rem 1rem',
  fontSize: '1rem',
  boxSizing: 'border-box',
};

const SpecialistProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [specialist, setSpecialist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    const fetchSpecialist = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getSpecialistById(id);
        setSpecialist(data);
      } catch (err) {
        setError('Nie udało się wczytać profilu specjalisty');
      } finally {
        setLoading(false);
      }
    };
    fetchSpecialist();
  }, [id]);

  const handleOpenBooking = () => {
    if (!user) {
      setBookingError('Zaloguj się, aby zarezerwować wizytę');
      return;
    }
    if (user.role !== 'owner') {
      setBookingError('Tylko właściciele zwierząt mogą rezerwować wizyty');
      return;
    }
    if (!selectedDate || !selectedTime) {
      setBookingError('Wybierz datę i godzinę przed rezerwacją');
      return;
    }
    setBookingError('');
    setBookingSuccess('');
    setShowModal(true);
  };

  const confirmBooking = async () => {
    try {
      await createBooking({
        specialist_id: parseInt(id),
        date: selectedDate,
        time: selectedTime,
      });
      setBookingSuccess(`Wizyta zarezerwowana na ${selectedDate} o ${selectedTime}!`);
      setShowModal(false);
      setSelectedDate('');
      setSelectedTime('');
    } catch (err) {
      setBookingError(err.response?.data?.error || 'Błąd podczas rezerwacji wizyty');
      setShowModal(false);
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: 'calc(100vh - 80px)', padding: '2rem' }}>
        <div
          className="max-w-2xl mx-auto"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '1.5rem', animation: 'pulse 2s infinite', opacity: 0.5 }}
        >
          <div style={{ width: '6rem', height: '6rem', backgroundColor: 'var(--border)', borderRadius: '50%', marginBottom: '1rem' }}></div>
          <div style={{ height: '1.5rem', backgroundColor: 'var(--border)', borderRadius: '0.25rem', marginBottom: '0.5rem' }}></div>
          <div style={{ height: '1rem', backgroundColor: 'var(--border)', borderRadius: '0.25rem' }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: 'calc(100vh - 80px)', padding: '2rem' }}>
        <div
          className="max-w-2xl mx-auto"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '1.5rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fca5a5' }}>
            <AlertCircle size={20} />
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: 'calc(100vh - 80px)', padding: '2rem' }}>
      <div
        className="max-w-2xl mx-auto"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '1.5rem' }}
      >
        {/* Header — avatar + basic info */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '1.5rem' }}>
          {specialist.photo_url ? (
            <img
              src={specialist.photo_url}
              alt={specialist.name}
              style={{ width: '6rem', height: '6rem', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '6rem',
                height: '6rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <User size={32} style={{ color: 'var(--text-secondary)' }} />
            </div>
          )}
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              {specialist.name}
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--accent)', margin: '0.25rem 0 0 0' }}>
              {specialist.specialization}
            </p>
            <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
              {specialist.city}
            </p>
          </div>
        </div>

        {/* Bio */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            O mnie
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            {specialist.bio || 'Brak opisu.'}
          </p>
        </div>

        {/* Booking form */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} />
            Zarezerwuj wizytę
          </h2>

          {user?.role === 'owner' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                  Data
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={todayDate()}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                  Godzina
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                >
                  <option value="">Wybierz godzinę</option>
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleOpenBooking}
                style={{
                  backgroundColor: 'var(--accent)',
                  color: '#0f0f0f',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.2s ease',
                  alignSelf: 'flex-start',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = 'var(--accent-hover)')}
                onMouseOut={(e) => (e.target.style.backgroundColor = 'var(--accent)')}
              >
                Zarezerwuj
              </button>
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>
              {user
                ? 'Tylko właściciele zwierząt mogą rezerwować wizyty.'
                : 'Zaloguj się jako właściciel, aby zarezerwować wizytę.'}
            </p>
          )}
        </div>

        {/* Feedback messages */}
        {bookingError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', backgroundColor: 'rgba(220, 38, 38, 0.1)', borderRadius: '0.5rem', color: '#fca5a5', marginBottom: '1rem' }}>
            <AlertCircle size={18} />
            {bookingError}
          </div>
        )}
        {bookingSuccess && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '0.5rem', color: '#86efac' }}>
            <CheckCircle size={18} />
            {bookingSuccess}
          </div>
        )}
      </div>

      {/* Confirmation modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              maxWidth: '28rem',
              width: '100%',
            }}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Potwierdź rezerwację
            </h3>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
              Czy chcesz zarezerwować wizytę u <strong style={{ color: 'var(--text-primary)' }}>{specialist?.name}</strong>{' '}
              dnia <strong style={{ color: 'var(--text-primary)' }}>{selectedDate}</strong>{' '}
              o <strong style={{ color: 'var(--text-primary)' }}>{selectedTime}</strong>?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: '500',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = 'var(--border)')}
                onMouseOut={(e) => (e.target.style.backgroundColor = 'var(--bg-secondary)')}
              >
                Anuluj
              </button>
              <button
                onClick={confirmBooking}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'var(--accent)',
                  color: '#0f0f0f',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: '600',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = 'var(--accent-hover)')}
                onMouseOut={(e) => (e.target.style.backgroundColor = 'var(--accent)')}
              >
                Potwierdź
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialistProfile;
