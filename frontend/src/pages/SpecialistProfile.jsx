import React from 'react';
import { useParams } from 'react-router-dom';

const SpecialistProfile = () => {
  const { id } = useParams();

  // Mock data - replace with API call
  const specialist = {
    id,
    name: 'Dr. John Doe',
    specialty: 'Veterinarian',
    location: 'New York',
    rating: 4.5,
    reviews: 120,
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{specialist.name}</h1>
        <p className="text-lg text-gray-600 mb-2">{specialist.specialty}</p>
        <p className="text-gray-500 mb-4">{specialist.location}</p>
        <div className="flex items-center mb-4">
          <span className="text-yellow-500 mr-2">⭐ {specialist.rating}</span>
          <span className="text-gray-500">({specialist.reviews} reviews)</span>
        </div>
        <button className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200">
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default SpecialistProfile;