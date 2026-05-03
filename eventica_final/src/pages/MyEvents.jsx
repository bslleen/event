import React, { useState } from 'react';
import { useEvents } from '../context/EventsContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import CreateEventModal from '../components/CreateEventModal';
import ConfirmDialog from '../components/ConfirmDialog';

const IconCal = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IconPin = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;

function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function MyEvents() {
  const { userEvents, updateEvent, deleteEvent } = useEvents();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function handleEditSubmit(data) {
    await updateEvent(editTarget.id, { ...data, status: 'pending' });
    setEditTarget(null);
    addToast('Événement modifié et resoumis pour validation.', 'success');
  }

  async function handleDelete() {
    await deleteEvent(deleteTarget.id);
    setDeleteTarget(null);
    addToast('Événement supprimé.', 'info');
  }

  return (
    <>
      <div className="page-header">
        <div className="page-title">Mes Événements</div>
        <div className="page-subtitle">Gérez vos événements soumis</div>
      </div>

      <div className="section">
        {userEvents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <h3>Aucun événement</h3>
            <p>Vous n'avez pas encore créé d'événements.</p>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/create-event')}>
              + Créer un événement
            </button>
          </div>
        ) : (
          <div className="my-events-list">
            {userEvents.map(event => (
              <div key={event.id} className="my-event-item">
                {event.photos?.[0]
                  ? <img src={event.photos[0]} alt="" className="my-event-img" onError={e => { e.target.style.display = 'none'; }} />
                  : <div className="my-event-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🎉</div>
                }
                <div className="my-event-info">
                  <div className="my-event-title">{event.title}</div>
                  <div className="my-event-meta">
                    <div className="my-event-meta-item"><IconCal /> {fmtDate(event.date)} • {event.time}</div>
                    <div className="my-event-meta-item"><IconPin /> {event.location}</div>
                  </div>
                </div>

                <span className={`badge badge-${event.status}`} style={{ flexShrink: 0 }}>
                  {event.status === 'approved' ? '✓' : event.status === 'pending' ? '⏳' : '✗'} {event.status}
                </span>

                <div className="my-event-actions">
                  {event.status !== 'approved' && (
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditTarget(event)}>
                      Modifier
                    </button>
                  )}
                  <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(event)}>
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateEventModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={handleEditSubmit}
        initial={editTarget}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Supprimer l'événement"
        message={`Supprimer définitivement "${deleteTarget?.title}" ?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
