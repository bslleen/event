import React, { useState, useEffect } from 'react';
import { apiGetUsers, apiDeleteUser } from '../utils/api';
import { useEvents } from '../context/EventsContext';
import { useToast } from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';

const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;

function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminUsers() {
  const [users, setUsers]            = useState([]);
  const [loading, setLoading]        = useState(true);
  const { events, deleteEvent }      = useEvents();
  const { addToast }                 = useToast();
  const [deleteTarget, setDelTarget] = useState(null);
  const [search, setSearch]          = useState('');

  useEffect(() => {
    apiGetUsers()
      .then(d => setUsers(d.users || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleDeleteUser() {
    try {
      await apiDeleteUser(deleteTarget.id);
      setUsers(prev => prev.filter(u => u.id !== deleteTarget.id));
      // حذف أحداثه محلياً من الـ state
      events.filter(e => e.organizerId === String(deleteTarget.id)).forEach(e => deleteEvent(e.id));
      addToast('Utilisateur supprimé.', 'info');
    } catch (err) {
      addToast(err.message, 'error');
    }
    setDelTarget(null);
  }

  const filtered = users.filter(u =>
    !search ||
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div style={{ padding: 32, color: 'var(--text-secondary)' }}>Chargement...</div>;

  return (
    <>
      <div className="page-header">
        <div className="page-title">Utilisateurs</div>
        <div className="page-subtitle">Gérer les utilisateurs inscrits</div>
      </div>

      <div className="section">
        <div className="table-container">
          <div className="table-header">
            <div className="table-title">{users.length} utilisateurs inscrits</div>
            <div className="search-bar" style={{ maxWidth: 260 }}>
              <IconSearch />
              <input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {filtered.length === 0
            ? <div className="empty-state" style={{ padding: 48 }}><div className="empty-state-icon">👥</div><h3>Aucun utilisateur trouvé</h3></div>
            : <table>
                <thead><tr><th>Utilisateur</th><th>Email</th><th>Événements</th><th>Inscrit le</th><th>Actions</th></tr></thead>
                <tbody>
                  {filtered.map(user => {
                    const initials = (user.username || 'U').slice(0, 2).toUpperCase();
                    const cnt = events.filter(e => e.organizerId === String(user.id)).length;
                    return (
                      <tr key={user.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,var(--purple),var(--accent-pink))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                              {initials}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 14 }}>{user.username}</div>
                              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user.role || 'user'}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{user.email}</td>
                        <td>
                          <span style={{ fontWeight: 600 }}>{cnt}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}> événement{cnt !== 1 ? 's' : ''}</span>
                        </td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{fmtDate(user.created_at)}</td>
                        <td>
                          {user.role !== 'admin' && (
                            <button className="btn btn-danger btn-sm" onClick={() => setDelTarget(user)}>🗑 Supprimer</button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
          }
        </div>
      </div>

      {/* Admin row */}
      <div className="section" style={{ paddingTop: 0 }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(245,158,11,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🛡</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Compte Admin</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>bouchra — Ce compte ne peut pas être supprimé</div>
          </div>
          <span className="badge badge-pending" style={{ marginLeft: 'auto' }}>Admin</span>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Supprimer l'utilisateur"
        message={`Supprimer "${deleteTarget?.username}" ? Ses événements seront également supprimés.`}
        onConfirm={handleDeleteUser}
        onCancel={() => setDelTarget(null)}
        confirmLabel="Supprimer"
      />
    </>
  );
}
