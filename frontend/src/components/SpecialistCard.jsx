import React from 'react';
import { useNavigate } from 'react-router-dom';

const SpecialistCard = ({ id, name, specialization, city, bio, photo_url }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/specialists/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200 cursor-pointer"
    >
      <div className="flex items-center mb-4">
        {photo_url ? (
          <img
            src={photo_url}
            alt={name}
            className="w-16 h-16 rounded-full object-cover mr-4"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mr-4">
            <span className="text-gray-600 text-xl font-bold">{name.charAt(0)}</span>
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {specialization}
          </span>
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-2">{city}</p>
      <p className="text-gray-700 text-sm line-clamp-2">{bio}</p>
    </div>
  );
};

export default SpecialistCard;