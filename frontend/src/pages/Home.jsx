import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Znajdź specjalistę dla swojego pupila
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Łatwo znajdź weterynarzy, behawiorystów, groomerów i innych specjalistów opieki nad zwierzętami w Twojej okolicy.
        </p>
        <button
          onClick={() => navigate('/search')}
          className="bg-blue-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition duration-200 shadow-lg"
        >
          Szukaj specjalistów
        </button>
      </div>

      {/* Steps Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Jak to działa?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Szukaj</h3>
            <p className="text-gray-600">Znajdź specjalistę w swojej okolicy według specjalizacji i miasta.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Rezerwuj</h3>
            <p className="text-gray-600">Wybierz dogodny termin i zarezerwuj wizytę online.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">😊</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Ciesz się wizytą</h3>
            <p className="text-gray-600">Twój pupil otrzyma najlepszą opiekę od sprawdzonych specjalistów.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;