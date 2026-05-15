import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyBookings, cancelBooking, updateBookingStatus, getMyServices, addService, deleteService } from '../services/api';
import { Clock, AlertCircle, CheckCircle, X, Calendar, Stethoscope, Plus, Trash2 } from 'lucide-react';

const STATUS_COLORS = {
  oczekująca:  { bg: 'rgba(245, 158, 11, 0.1)',  text: '#f59e0b' },
  potwierdzona: { bg: 'rgba(34, 197, 94, 0.1)',   text: '#22c55e' },
  anulowana:   { bg: 'rgba(220, 38, 38, 0.1)',   text: '#dc2626' },
};

const STATUS_ICONS = {
  oczekująca:  <Clock size={16} />,
  potwierdzona: <CheckCircle size={16} />,
  anulowana:   <X size={16} />,
};

const StatusBadge = ({ status }) => {
  const colors = STATUS_COLORS[status] || { bg: 'var(--bg-card)', text: 'var(--text-secondary)' };
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginTop: '0.5rem',
        padding: '0.25rem 0.75rem',
        backgroundColor: colors.bg,
        color: colors.text,
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '500',
      }}
    >
      {STATUS_ICONS[status] || null}
      {status}
    </div>
  );
};

const ActionButton = ({ onClick, color, children }) => (
  <button
    onClick={onClick}
    style={{
      padding: '0.4rem 0.9rem',
      backgroundColor: `rgba(${color}, 0.1)`,
      color: `rgb(${color})`,
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontWeight: '500',
      fontSize: '0.85rem',
      transition: 'all 0.2s ease',
    }}
    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = `rgba(${color}, 0.2)`)}
    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = `rgba(${color}, 0.1)`)}
  >
    {children}
  </button>
);

const LoadingSkeleton = () => (
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
        <div style={{ height: '1rem', backgroundColor: 'var(--border)', borderRadius: '0.25rem', width: '60%' }}></div>
      </div>
    ))}
  </div>
);

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  // services state (specialist only)
  const [services, setServices] = useState([]);
  const [showAddService, setShowAddService] = useState(false);
  const [serviceForm, setServiceForm] = useState({ name: '', description: '', price: '', duration: '60' });
  const [serviceError, setServiceError] = useState('');
  const [serviceLoading, setServiceLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
    if (user?.role === 'specialist') fetchServices();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch {
      setError('Nie udało się wczytać rezerwacji');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    setActionError('');
    try {
      await cancelBooking(id);
      fetchBookings();
    } catch {
      setActionError('Nie udało się anulować rezerwacji');
    }
  };

  const handleStatusChange = async (id, status) => {
    setActionError('');
    try {
      await updateBookingStatus(id, status);
      fetchBookings();
    } catch {
      setActionError('Nie udało się zmienić statusu rezerwacji');
    }
  };

  const fetchServices = async () => {
    try {
      const data = await getMyServices();
      setServices(data);
    } catch {
      // silently fail — endpoint may not exist yet on backend
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    setServiceError('');
    if (!serviceForm.name || !serviceForm.price) {
      setServiceError('Nazwa i cena są wymagane');
      return;
    }
    setServiceLoading(true);
    try {
      await addService({
        name: serviceForm.name,
        description: serviceForm.description,
        price: parseFloat(serviceForm.price),
        duration: parseInt(serviceForm.duration) || 60,
      });
      setServiceForm({ name: '', description: '', price: '', duration: '60' });
      setShowAddService(false);
      fetchServices();
    } catch (err) {
      setServiceError(err.response?.data?.error || 'Nie udało się dodać usługi');
    } finally {
      setServiceLoading(false);
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await deleteService(id);
      fetchServices();
    } catch {
      setServiceError('Nie udało się usunąć usługi');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const containerStyle = {
    backgroundColor: 'var(--bg-primary)',
    minHeight: 'calc(100vh - 80px)',
    padding: '2rem',
  };

  const cardStyle = {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '0.75rem',
    padding: '1.5rem',
  };

  const headingStyle = {
    fontFamily: "'Syne', sans-serif",
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
    color: 'var(--text-primary)',
  };

  // ──────────────────────────────────────────────
  // OWNER VIEW
  // ──────────────────────────────────────────────
  if (user?.role === 'owner') {
    return (
      <div style={containerStyle}>
        <div className="max-w-4xl mx-auto">
          <h1 style={headingStyle}>Moje rezerwacje</h1>

          {actionError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', backgroundColor: 'rgba(220, 38, 38, 0.1)', borderRadius: '0.5rem', color: '#fca5a5', marginBottom: '1rem' }}>
              <AlertCircle size={18} />
              {actionError}
            </div>
          )}

          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', backgroundColor: 'rgba(220, 38, 38, 0.1)', borderRadius: '0.75rem', color: '#fca5a5' }}>
              <AlertCircle size={20} />
              {error}
            </div>
          ) : bookings.length === 0 ? (
            <div style={{ ...cardStyle, textAlign: 'center' }}>
              <Calendar size={40} style={{ color: 'var(--text-secondary)', margin: '0 auto 1rem' }} />
              <p style={{ color: 'var(--text-secondary)' }}>Nie masz jeszcze żadnych rezerwacji.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {bookings.map((booking) => (
                <div key={booking.id} style={cardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>
                        {booking.specialist_name}
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                        {booking.date} o {booking.time}
                      </p>
                      <StatusBadge status={booking.status} />
                    </div>
                    {(booking.status === 'oczekująca' || booking.status === 'potwierdzona') && (
                      <ActionButton onClick={() => handleCancel(booking.id)} color="220, 38, 38">
                        Anuluj
                      </ActionButton>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────
  // SPECIALIST VIEW
  // ──────────────────────────────────────────────
  if (user?.role === 'specialist') {
    const pending   = bookings.filter((b) => b.status === 'oczekująca');
    const confirmed = bookings.filter((b) => b.status === 'potwierdzona');
    const past      = bookings.filter((b) => b.status === 'anulowana');

    return (
      <div style={containerStyle}>
        <div className="max-w-4xl mx-auto">
          <h1 style={headingStyle}>Panel specjalisty</h1>

          {actionError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', backgroundColor: 'rgba(220, 38, 38, 0.1)', borderRadius: '0.5rem', color: '#fca5a5', marginBottom: '1rem' }}>
              <AlertCircle size={18} />
              {actionError}
            </div>
          )}

          {/* ── Moje usługi ── */}
          <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: services.length > 0 || showAddService ? '1rem' : 0 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <Stethoscope size={20} />
                Moje usługi
              </h2>
              <button
                onClick={() => { setShowAddService(!showAddService); setServiceError(''); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  backgroundColor: showAddService ? 'var(--bg-secondary)' : 'var(--accent)',
                  color: showAddService ? 'var(--text-secondary)' : '#0f0f0f',
                  border: 'none', borderRadius: '0.5rem', padding: '0.4rem 0.9rem',
                  fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer',
                }}
              >
                <Plus size={16} />
                {showAddService ? 'Anuluj' : 'Dodaj usługę'}
              </button>
            </div>

            {showAddService && (
              <form onSubmit={handleAddService} style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', display: 'grid', gap: '0.75rem' }}>
                {serviceError && (
                  <p style={{ color: '#fca5a5', margin: 0, fontSize: '0.875rem' }}>{serviceError}</p>
                )}
                <input
                  type="text" placeholder="Nazwa usługi *" value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  style={{ backgroundColor: '#1a1a1a', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '0.5rem', padding: '0.6rem 0.9rem', fontSize: '0.95rem' }}
                />
                <input
                  type="text" placeholder="Opis (opcjonalnie)" value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  style={{ backgroundColor: '#1a1a1a', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '0.5rem', padding: '0.6rem 0.9rem', fontSize: '0.95rem' }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <input
                    type="number" placeholder="Cena (zł) *" min="0" step="0.01" value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    style={{ backgroundColor: '#1a1a1a', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '0.5rem', padding: '0.6rem 0.9rem', fontSize: '0.95rem' }}
                  />
                  <input
                    type="number" placeholder="Czas trwania (min)" min="1" value={serviceForm.duration}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                    style={{ backgroundColor: '#1a1a1a', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '0.5rem', padding: '0.6rem 0.9rem', fontSize: '0.95rem' }}
                  />
                </div>
                <button
                  type="submit" disabled={serviceLoading}
                  style={{ backgroundColor: 'var(--accent)', color: '#0f0f0f', border: 'none', borderRadius: '0.5rem', padding: '0.6rem 1.2rem', fontWeight: '600', cursor: serviceLoading ? 'not-allowed' : 'pointer', alignSelf: 'flex-start', opacity: serviceLoading ? 0.7 : 1 }}
                >
                  {serviceLoading ? 'Dodawanie...' : 'Zapisz usługę'}
                </button>
              </form>
            )}

            {services.length === 0 && !showAddService ? (
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Brak usług — dodaj pierwszą klikając przycisk powyżej.</p>
            ) : (
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {services.map((svc) => (
                  <div key={svc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem', padding: '0.75rem 1rem', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: 'var(--text-primary)', fontWeight: '600', margin: '0 0 0.15rem 0' }}>{svc.name}</p>
                      {svc.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>{svc.description}</p>}
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexShrink: 0 }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{svc.duration} min</span>
                      <span style={{ color: 'var(--accent)', fontWeight: '700' }}>{svc.price} zł</span>
                      <button
                        onClick={() => handleDeleteService(svc.id)}
                        title="Usuń usługę"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '0.2rem', display: 'flex', alignItems: 'center' }}
                        onMouseOver={(e) => (e.currentTarget.style.color = '#fca5a5')}
                        onMouseOut={(e) => (e.currentTarget.style.color = '#dc2626')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', backgroundColor: 'rgba(220, 38, 38, 0.1)', borderRadius: '0.75rem', color: '#fca5a5' }}>
              <AlertCircle size={20} />
              {error}
            </div>
          ) : (
            <>
              {/* Pending */}
              <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: pending.length === 0 ? 0 : '1rem', color: 'var(--text-primary)' }}>
                  Oczekujące rezerwacje
                  {pending.length > 0 && (
                    <span style={{ marginLeft: '0.5rem', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', borderRadius: '9999px', padding: '0.1rem 0.6rem', fontSize: '0.85rem' }}>
                      {pending.length}
                    </span>
                  )}
                </h2>
                {pending.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Brak oczekujących rezerwacji</p>
                ) : (
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {pending.map((booking) => (
                      <div
                        key={booking.id}
                        style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}
                      >
                        <div>
                          <p style={{ color: 'var(--text-primary)', fontWeight: '500', margin: '0 0 0.2rem 0' }}>
                            {booking.owner_email}
                          </p>
                          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
                            {booking.date} o {booking.time}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <ActionButton onClick={() => handleStatusChange(booking.id, 'potwierdzona')} color="34, 197, 94">
                            Potwierdź
                          </ActionButton>
                          <ActionButton onClick={() => handleStatusChange(booking.id, 'anulowana')} color="220, 38, 38">
                            Odrzuć
                          </ActionButton>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirmed */}
              <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: confirmed.length === 0 ? 0 : '1rem', color: 'var(--text-primary)' }}>
                  Nadchodzące wizyty
                </h2>
                {confirmed.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Brak potwierdzonych wizyt</p>
                ) : (
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {confirmed.map((booking) => (
                      <div
                        key={booking.id}
                        style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}
                      >
                        <div>
                          <p style={{ color: 'var(--text-primary)', fontWeight: '500', margin: '0 0 0.2rem 0' }}>
                            {booking.owner_email}
                          </p>
                          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
                            {booking.date} o {booking.time}
                          </p>
                          <StatusBadge status={booking.status} />
                        </div>
                        <ActionButton onClick={() => handleStatusChange(booking.id, 'anulowana')} color="220, 38, 38">
                          Anuluj
                        </ActionButton>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cancelled */}
              {past.length > 0 && (
                <div style={cardStyle}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                    Anulowane
                  </h2>
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {past.map((booking) => (
                      <div
                        key={booking.id}
                        style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem', padding: '1rem', opacity: 0.6 }}
                      >
                        <p style={{ color: 'var(--text-primary)', margin: '0 0 0.2rem 0' }}>{booking.owner_email}</p>
                        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
                          {booking.date} o {booking.time}
                        </p>
                        <StatusBadge status={booking.status} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <p style={{ color: 'var(--text-secondary)' }}>Nieznana rola użytkownika</p>
    </div>
  );
};

export default Dashboard;
