import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin } from 'lucide-react';

const SpecialistCard = ({ id, name, specialization, city, bio, photo_url }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/specialists/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent)';
        e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.02)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.backgroundColor = 'var(--bg-card)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', gap: '1rem' }}>
        {photo_url ? (
          <img
            src={photo_url}
            alt={name}
            style={{
              width: '4rem',
              height: '4rem',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              width: '4rem',
              height: '4rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <User size={24} style={{ color: 'var(--text-secondary)' }} />
          </div>
        )}
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
            {name}
          </h3>
          <span
            style={{
              display: 'inline-block',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              color: 'var(--accent)',
              fontSize: '0.75rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontWeight: '500',
            }}
          >
            {specialization}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
        <MapPin size={16} />
        {city}
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.5', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', margin: 0 }}>
        {bio}
      </p>
    </div>
  );
};

export default SpecialistCard;