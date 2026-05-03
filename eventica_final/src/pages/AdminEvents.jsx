import React, { useState } from 'react';
import { useEvents } from '../context/EventsContext';
import { useToast } from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';

const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;

function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

const FILTERS = ['all', 'pending', 'approved', 'rejected'];

export default function AdminEvents() {
  const { events, approveEvent, rejectEvent, deleteEvent } = useEvents();
  const { addToast } = useToast();
  const [filter, setFilter]       = useState('all');
  const [search, setSearch]       = useState('');
  const [deleteTarget, setDelTarget] = useState(null);

  const filtered = events.filter(e => {
    const mf = filter === 'all' || e.status === filter;
    const ms = !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.organizerName?.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  return (
    <>
      <div className="page-header">
        <div className="page-title">Tous les événements</div>
        <div className="page-subtitle">Gérer et valider tous les événements soumis</div>
      </div>

      <div className="section">
        <div className="filter-bar">
          {FILTERS.map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'Tous' : f === 'pending' ? 'En attente' : f === 'approved' ? 'Approuvés' : 'Rejetés'}
              <span className="filter-count">{f === 'all' ? events.length : events.filter(e => e.status === f).length}</span>
            </button>
          ))}
          <div className="search-bar" style={{ flex: 1, maxWidth: 280, marginLeft: 'auto' }}>
            <IconSearch />
            <input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="table-container">
          {filtered.length === 0
            ? <div className="empty-state" style={{ padding: 48 }}><div className="empty-state-icon">📋</div><h3>Aucun événement</h3></div>
            : <table>
                <thead><tr><th>Événement</th><th>Organisateur</th><th>Date</th><th>Statut</th><th>Actions</th></tr></thead>
                <tbody>
                  {filtered.map(event => (
                    <tr key={event.id}>
                      <td>
                        <div className="table-event-cell">
                          {event.photos?.[0]
                            ? <img src={event.photos[0]} alt="" className="table-event-img" />
                            : <div className="table-event-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎉</div>
                          }
                          <div>
                            <div className="table-event-name">{event.title}</div>
                            <div className="table-event-sub">{event.location}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{event.organizerName}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{fmtDate(event.date)}</td>
                      <td><span className={`badge badge-${event.status}`}>{event.status}</span></td>
                      <td>
                        <div className="table-actions">
                          {event.status === 'pending' && (
                            <>
                              <button className="btn btn-success btn-sm" onClick={() => { approveEvent(event.id); addToast('Approuvé !', 'success'); }}>✓</button>
                              <button className="btn btn-danger btn-sm"  onClick={() => { rejectEvent(event.id);  addToast('Rejeté.', 'info'); }}>✕</button>
                            </>
                          )}
                          {event.status === 'approved' && (
                            <button className="btn btn-danger btn-sm" onClick={() => { rejectEvent(event.id); addToast('Rejeté.', 'info'); }}>✕ Rejeter</button>
                          )}
                          {event.status === 'rejected' && (
                            <button className="btn btn-success btn-sm" onClick={() => { approveEvent(event.id); addToast('Approuvé !', 'success'); }}>✓ Approuver</button>
                          )}
                          <button className="btn btn-secondary btn-sm" style={{ color: 'var(--accent-red)' }} onClick={() => setDelTarget(event)}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Supprimer l'événement"
        message={`Supprimer définitivement "${deleteTarget?.title}" ?`}
        onConfirm={() => { deleteEvent(deleteTarget.id); setDelTarget(null); addToast('Supprimé.', 'info'); }}
        onCancel={() => setDelTarget(null)}
      />
    </>
  );
}
