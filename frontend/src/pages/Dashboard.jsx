import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
        <p className="text-lg text-gray-600 mb-4">Welcome back, {user?.name || 'User'}!</p>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-md">
            <h2 className="text-xl font-semibold mb-2">Your Bookings</h2>
            <p className="text-gray-500">No bookings yet.</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;