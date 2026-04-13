import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              🐾 PetMarket
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/search" className="text-gray-600 hover:text-blue-600">
              Znajdź specjalistę
            </Link>
            {user ? (
              <>
                <span className="text-gray-600">{user.email}</span>
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                >
                  Wyloguj
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600">
                  Zaloguj
                </Link>
                <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">
                  Zarejestruj się
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <Link to="/search" className="block py-2 text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>
              Znajdź specjalistę
            </Link>
            {user ? (
              <>
                <span className="block py-2 text-gray-600">{user.email}</span>
                <Link to="/dashboard" className="block py-2 text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="block w-full text-left py-2 bg-red-500 text-white px-4 rounded-md hover:bg-red-600 transition duration-200 mt-2"
                >
                  Wyloguj
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                  Zaloguj
                </Link>
                <Link to="/register" className="block py-2 bg-blue-500 text-white px-4 rounded-md hover:bg-blue-600 transition duration-200 mt-2" onClick={() => setIsOpen(false)}>
                  Zarejestruj się
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;