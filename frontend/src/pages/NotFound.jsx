import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-6">Strona nie istnieje</h2>
        <p className="text-gray-500 mb-8">Przepraszamy, ale strona której szukasz nie została znaleziona.</p>
        <Link
          to="/"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Wróć do strony głównej
        </Link>
      </div>
    </div>
  );
};

export default NotFound;