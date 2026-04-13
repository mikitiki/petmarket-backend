import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSpecialistById, createBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';

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
        setError('Failed to load specialist profile');
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
      setBookedSlots(prev => new Set([...prev, selectedSlot.id]));
      setShowModal(false);
    } catch (err) {
      setBookingError('Błąd podczas rezerwacji wizyty');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md animate-pulse">
          <div className="w-24 h-24 bg-gray-300 rounded-full mb-4"></div>
          <div className="h-6 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <p className="text-red-500 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          {specialist.photo_url ? (
            <img
              src={specialist.photo_url}
              alt={specialist.name}
              className="w-24 h-24 rounded-full object-cover mr-6"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mr-6">
              <span className="text-gray-600 text-2xl font-bold">{specialist.name.charAt(0)}</span>
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{specialist.name}</h1>
            <p className="text-lg text-gray-600">{specialist.specialization}</p>
            <p className="text-gray-500">{specialist.city}</p>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">O mnie</h2>
          <p className="text-gray-700">{specialist.bio}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Dostępne terminy</h2>
          {specialist.available_slots && specialist.available_slots.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {specialist.available_slots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => handleBookSlot(slot)}
                  disabled={bookedSlots.has(slot.id)}
                  className={`p-3 border rounded-md text-center ${
                    bookedSlots.has(slot.id)
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100'
                  }`}
                >
                  <div className="font-semibold">{slot.date}</div>
                  <div className="text-sm">{slot.time}</div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Brak dostępnych terminów</p>
          )}
        </div>

        {bookingError && <p className="text-red-500 mb-4">{bookingError}</p>}
        {bookingSuccess && <p className="text-green-500 mb-4">{bookingSuccess}</p>}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Potwierdź rezerwację</h3>
            <p className="mb-6">
              Czy chcesz zarezerwować wizytę dnia {selectedSlot.date} o {selectedSlot.time}?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Anuluj
              </button>
              <button
                onClick={confirmBooking}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
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