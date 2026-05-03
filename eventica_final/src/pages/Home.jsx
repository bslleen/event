import React, { useState } from 'react';
import { useEvents } from '../context/EventsContext';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';

const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;

export default function Home() {
  const { approvedEvents, events } = useEvents();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = approvedEvents.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase()) ||
    e.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="hero">
        <div className="hero-eyebrow">✦ Plateforme d'événements</div>
        <h1 className="hero-title">
          Découvrez & Partagez<br />
          <span className="highlight">Incroyables</span> Événements
        </h1>
        <p className="hero-subtitle">
          Trouvez des événements autour de vous et créez les vôtres. Partagez des expériences. Connectez-vous avec les gens.
        </p>
        <div className="hero-search">
          <div className="search-bar" style={{ flex: 1, maxWidth: 420 }}>
            <IconSearch />
            <input
              placeholder="Rechercher par nom, lieu..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/create-event')}>
            + Créer un événement
          </button>
        </div>
        <div className="hero-stats">
          {[
            [approvedEvents.length, 'Événements approuvés'],
            [events.filter(e => e.status === 'pending').length, 'En attente'],
            [events.length, 'Total événements'],
          ].map(([num, lbl]) => (
            <div key={lbl}>
              <div className="hero-stat-num">{num}</div>
              <div className="hero-stat-lbl">{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <div className="section-title">
            {search ? `Résultats pour "${search}"` : 'Événements à venir'}
          </div>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {filtered.length} événement{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>Aucun événement trouvé</h3>
            <p>{search ? 'Essayez un autre terme.' : 'Aucun événement approuvé pour l\'instant.'}</p>
          </div>
        ) : (
          <div className="events-grid">
            {filtered.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        )}
      </div>
    </>
  );
}
