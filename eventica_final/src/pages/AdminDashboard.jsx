import React, { useEffect, useState } from 'react';
import { useEvents } from '../context/EventsContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { apiGetUsers } from '../utils/api';

function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminDashboard() {
  const { events, approvedEvents, pendingEvents, approveEvent, rejectEvent } = useEvents();
  const { addToast } = useToast();
  const navigate     = useNavigate();
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    apiGetUsers().then(d => setUserCount((d.users || []).length)).catch(() => {});
  }, []);

  const stats = [
    { label: 'Total événements', value: events.length,         icon: '📅', color: '#7c3aed', bg: 'rgba(124,58,237,.15)' },
    { label: 'En attente',       value: pendingEvents.length,  icon: '⏳', color: '#f59e0b', bg: 'rgba(245,158,11,.15)' },
    { label: 'Approuvés',        value: approvedEvents.length, icon: '✓',  color: '#10b981', bg: 'rgba(16,185,129,.15)' },
    { label: 'Utilisateurs',     value: userCount,             icon: '👥', color: '#06b6d4', bg: 'rgba(6,182,212,.15)' },
  ];

  return (
    <>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="page-title">Dashboard</div>
          <span className="admin-badge">🛡 Admin</span>
        </div>
        <div className="page-subtitle">Vue d'ensemble des événements et utilisateurs</div>
      </div>

      <div className="section">
        <div className="stats-grid">
          {stats.map(s => (
            <div key={s.label} className="stat-card">
              <div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              </div>
              <div className="stat-icon" style={{ background: s.bg, color: s.color, fontSize: 20 }}>{s.icon}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending */}
      <div className="section" style={{ paddingTop: 0 }}>
        <div className="table-container">
          <div className="table-header">
            <div className="table-title">Événements en attente</div>
            {pendingEvents.length > 0 && (
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/events')}>Voir tout →</button>
            )}
          </div>
          {pendingEvents.length === 0
            ? <div className="empty-state" style={{ padding: 40 }}><div className="empty-state-icon">✅</div><h3>Tout est validé !</h3></div>
            : <table>
                <thead><tr><th>Événement</th><th>Organisateur</th><th>Date</th><th>Actions</th></tr></thead>
                <tbody>
                  {pendingEvents.slice(0, 5).map(event => (
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
                      <td>
                        <div className="table-actions">
                          <button className="btn btn-success btn-sm" onClick={() => { approveEvent(event.id); addToast('Événement approuvé !', 'success'); }}>✓ Approuver</button>
                          <button className="btn btn-danger btn-sm"  onClick={() => { rejectEvent(event.id);  addToast('Événement rejeté.', 'info'); }}>✕ Rejeter</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>
      </div>

      {/* Approved recent */}
      <div className="section" style={{ paddingTop: 0 }}>
        <div className="table-container">
          <div className="table-header"><div className="table-title">Derniers approuvés</div></div>
          {approvedEvents.length === 0
            ? <div className="empty-state" style={{ padding: 32 }}><p>Aucun événement approuvé.</p></div>
            : <table>
                <thead><tr><th>Événement</th><th>Organisateur</th><th>Date</th><th>Statut</th></tr></thead>
                <tbody>
                  {approvedEvents.slice(0, 5).map(event => (
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
                      <td><span className="badge badge-approved">✓ Approuvé</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>
      </div>
    </>
  );
}
