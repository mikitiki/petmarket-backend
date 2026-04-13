import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyBookings, cancelBooking } from '../services/api';

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
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelBooking(id);
      fetchBookings(); // Refresh the list
    } catch (err) {
      setError('Failed to cancel booking');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'oczekująca':
        return 'bg-yellow-100 text-yellow-800';
      case 'potwierdzona':
        return 'bg-green-100 text-green-800';
      case 'anulowana':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">PetMarket</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/search')}
              className="text-gray-600 hover:text-blue-600"
            >
              Szukaj
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
            >
              Wyloguj
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-8">
        {user?.role === 'owner' ? (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Moje rezerwacje</h1>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white p-4 rounded-lg shadow-md animate-pulse">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : bookings.length === 0 ? (
              <p className="text-gray-500">Brak rezerwacji</p>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {booking.specialist_name}
                        </h3>
                        <p className="text-gray-600">{booking.date} o {booking.time}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      {(booking.status === 'oczekująca' || booking.status === 'potwierdzona') && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
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
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Panel specjalisty</h1>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-2">Zarządzanie grafikiem</h2>
              <p className="text-gray-500">Coming soon...</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Nadchodzące rezerwacje</h2>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg shadow-md animate-pulse">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : bookings.length === 0 ? (
                <p className="text-gray-500">Brak rezerwacji</p>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="bg-white p-4 rounded-lg shadow-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-600">{booking.owner_email}</p>
                          <p className="text-gray-600">{booking.date} o {booking.time}</p>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="text-gray-500">Nieznana rola użytkownika</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;