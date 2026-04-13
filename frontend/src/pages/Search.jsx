import React, { useState, useEffect } from 'react';
import { getSpecialists } from '../services/api';
import SpecialistCard from '../components/SpecialistCard';

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
      setError('Failed to load specialists');
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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Znajdź Specjalistów</h1>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Miasto"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Wszystkie specjalizacje</option>
              <option value="Weterynarz">Weterynarz</option>
              <option value="Behawiorysta">Behawiorysta</option>
              <option value="Groomer">Groomer</option>
              <option value="Inny">Inny</option>
            </select>
            <button
              onClick={handleFilterChange}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Szukaj
            </button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                <div className="w-16 h-16 bg-gray-300 rounded-full mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : specialists.length === 0 ? (
          <p className="text-gray-500 text-center">Brak wyników</p>
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