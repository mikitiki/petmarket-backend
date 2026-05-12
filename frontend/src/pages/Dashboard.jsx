import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyBookings, cancelBooking } from '../services/api';
import { Clock, AlertCircle, CheckCircle, X } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (err) {
      setError('Nie udało się wczytać rezerwacji');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelBooking(id);
      fetchBookings();
    } catch (err) {
      setError('Nie udało się anulować rezerwacji');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'oczekująca':
        return { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b' };
      case 'potwierdzona':
        return { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e' };
      case 'anulowana':
        return { bg: 'rgba(220, 38, 38, 0.1)', text: '#dc2626' };
      default:
        return { bg: 'var(--bg-card)', text: 'var(--text-secondary)' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'oczekująca':
        return <Clock size={16} />;
      case 'potwierdzona':
        return <CheckCircle size={16} />;
      case 'anulowana':
        return <X size={16} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: 'calc(100vh - 80px)', padding: '2rem' }}>
      <div className="max-w-4xl mx-auto">
        {user?.role === 'owner' ? (
          <>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              Moje rezerwacje
            </h1>

            {loading ? (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: '0.75rem',
                      padding: '1rem',
                      animation: 'pulse 2s infinite',
                      opacity: 0.5,
                    }}
                  >
                    <div style={{ height: '1rem', backgroundColor: 'var(--border)', borderRadius: '0.25rem', marginBottom: '0.5rem' }}></div>
                    <div style={{ height: '1rem', backgroundColor: 'var(--border)', borderRadius: '0.25rem' }}></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', backgroundColor: 'rgba(220, 38, 38, 0.1)', borderRadius: '0.75rem', color: '#fca5a5' }}>
                <AlertCircle size={20} />
                {error}
              </div>
            ) : bookings.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>Brak rezerwacji</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {bookings.map((booking) => (
                  <div key={booking.id} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
                          {booking.specialist_name}
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                          {booking.date} o {booking.time}
                        </p>
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginTop: '0.5rem',
                            padding: '0.25rem 0.75rem',
                            backgroundColor: getStatusColor(booking.status).bg,
                            color: getStatusColor(booking.status).text,
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                          }}
                        >
                          {getStatusIcon(booking.status)}
                          {booking.status}
                        </div>
                      </div>
                      {(booking.status === 'oczekująca' || booking.status === 'potwierdzona') && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'rgba(220, 38, 38, 0.1)',
                            color: '#fca5a5',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontWeight: '500',
                          }}
                          onMouseOver={(e) => (e.target.style.backgroundColor = 'rgba(220, 38, 38, 0.2)')}
                          onMouseOut={(e) => (e.target.style.backgroundColor = 'rgba(220, 38, 38, 0.1)')}
                        >
                          Anuluj
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : user?.role === 'specialist' ? (
          <>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              Panel specjalisty
            </h1>

            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Zarządzanie grafikiem
              </h2>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Wkrótce...</p>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Nadchodzące rezerwacje
              </h2>

              {loading ? (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        animation: 'pulse 2s infinite',
                        opacity: 0.5,
                      }}
                    >
                      <div style={{ height: '1rem', backgroundColor: 'var(--border)', borderRadius: '0.25rem', marginBottom: '0.5rem' }}></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div style={{ color: '#fca5a5' }}>{error}</div>
              ) : bookings.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>Brak rezerwacji</p>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {bookings.map((booking) => (
                    <div key={booking.id} style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem', padding: '1rem' }}>
                      <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{booking.owner_email}</p>
                      <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                        {booking.date} o {booking.time}
                      </p>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginTop: '0.5rem',
                          padding: '0.25rem 0.75rem',
                          backgroundColor: getStatusColor(booking.status).bg,
                          color: getStatusColor(booking.status).text,
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                        }}
                      >
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>Nieznana rola użytkownika</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;