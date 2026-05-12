import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSpecialistById, createBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, CheckCircle, User } from 'lucide-react';

const SpecialistProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [specialist, setSpecialist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookedSlots, setBookedSlots] = useState(new Set());

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

  const handleBookSlot = (slot) => {
    if (!user) {
      setBookingError('Zaloguj się, aby zarezerwować');
      return;
    }
    if (user.role !== 'owner') {
      setBookingError('Tylko właściciele zwierząt mogą rezerwować wizyty');
      return;
    }
    setSelectedSlot(slot);
    setShowModal(true);
    setBookingError('');
    setBookingSuccess('');
  };

  const confirmBooking = async () => {
    try {
      await createBooking({
        specialist_id: parseInt(id),
        date: selectedSlot.date,
        time: selectedSlot.time,
      });
      setBookingSuccess('Wizyta zarezerwowana!');
      setBookedSlots((prev) => new Set([...prev, selectedSlot.id]));
      setShowModal(false);
    } catch (err) {
      setBookingError('Błąd podczas rezerwacji wizyty');
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: 'calc(100vh - 80px)', padding: '2rem' }}>
        <div className="max-w-2xl mx-auto" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '1.5rem', animation: 'pulse 2s infinite', opacity: 0.5 }}>
          <div
            style={{
              width: '6rem',
              height: '6rem',
              backgroundColor: 'var(--border)',
              borderRadius: '50%',
              marginBottom: '1rem',
            }}
          ></div>
          <div style={{ height: '1.5rem', backgroundColor: 'var(--border)', borderRadius: '0.25rem', marginBottom: '0.5rem' }}></div>
          <div style={{ height: '1rem', backgroundColor: 'var(--border)', borderRadius: '0.25rem' }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: 'calc(100vh - 80px)', padding: '2rem' }}>
        <div className="max-w-2xl mx-auto" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '1.5rem' }}>
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
      <div className="max-w-2xl mx-auto" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '1.5rem' }}>
          {specialist.photo_url ? (
            <img
              src={specialist.photo_url}
              alt={specialist.name}
              style={{
                width: '6rem',
                height: '6rem',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
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

        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            O mnie
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            {specialist.bio}
          </p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Dostępne terminy
          </h2>
          {specialist.available_slots && specialist.available_slots.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {specialist.available_slots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => handleBookSlot(slot)}
                  disabled={bookedSlots.has(slot.id)}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid',
                    borderRadius: '0.5rem',
                    textAlign: 'center',
                    cursor: bookedSlots.has(slot.id) ? 'not-allowed' : 'pointer',
                    backgroundColor: bookedSlots.has(slot.id) ? 'var(--bg-secondary)' : 'var(--bg-secondary)',
                    borderColor: bookedSlots.has(slot.id) ? 'var(--border)' : 'var(--accent)',
                    color: bookedSlots.has(slot.id) ? 'var(--text-secondary)' : 'var(--accent)',
                    opacity: bookedSlots.has(slot.id) ? 0.5 : 1,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    if (!bookedSlots.has(slot.id)) {
                      e.target.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'var(--bg-secondary)';
                  }}
                >
                  <div style={{ fontWeight: '600', color: bookedSlots.has(slot.id) ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                    {slot.date}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: bookedSlots.has(slot.id) ? 'var(--text-secondary)' : 'var(--accent)' }}>
                    {slot.time}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>Brak dostępnych terminów</p>
          )}
        </div>

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

      {/* Confirmation Modal */}
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
              Czy chcesz zarezerwować wizytę dnia {selectedSlot?.date} o {selectedSlot?.time}?
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