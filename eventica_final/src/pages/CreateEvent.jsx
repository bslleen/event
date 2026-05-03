import React, { useState } from 'react';
import { useEvents } from '../context/EventsContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';

const PLACEHOLDER_PHOTOS = [
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
  'https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=600&q=80',
];

export default function CreateEvent() {
  const { createEvent } = useEvents();
  const { addToast }    = useToast();
  const navigate        = useNavigate();
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', location: '', date: '', time: '', description: '', registrationLink: '', photos: [] });
  const [errors, setErrors] = useState({});

  function set(f, v) { setForm(p => ({ ...p, [f]: v })); if (errors[f]) setErrors(e => ({ ...e, [f]: '' })); }

  function validate() {
    const e = {};
    if (!form.title.trim())       e.title       = 'Titre requis.';
    if (!form.location.trim())    e.location    = 'Lieu requis.';
    if (!form.date)               e.date        = 'Date requise.';
    if (!form.time)               e.time        = 'Heure requise.';
    if (!form.description.trim()) e.description = 'Description requise.';
    setErrors(e);
    return !Object.keys(e).length;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await createEvent({ ...form });
      addToast('Événement soumis pour validation !', 'success');
      setDone(true);
    } catch (err) {
      addToast(err.message || 'Erreur lors de la création', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  function handleFile(e) {
    Array.from(e.target.files).forEach(f => {
      const r = new FileReader();
      r.onload = ev => setForm(p => ({ ...p, photos: [...p.photos, ev.target.result] }));
      r.readAsDataURL(f);
    });
    e.target.value = '';
  }

  function handlePhotoUrl(e) {
    const url = e.target.value.trim();
    if (url && url.startsWith('http')) { set('photos', [...form.photos, url]); e.target.value = ''; }
  }

  function removePhoto(i) { set('photos', form.photos.filter((_, j) => j !== i)); }

  if (done) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: 16, padding: 24, textAlign: 'center' }}>
      <div style={{ fontSize: 64 }}>🎉</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>Événement soumis !</h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: 420, lineHeight: 1.6 }}>
        Votre événement est en attente de validation par un admin. Une fois approuvé, il apparaîtra sur la page d'accueil.
      </p>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button className="btn btn-secondary" onClick={() => navigate('/my-events')}>Mes événements</button>
        <button className="btn btn-primary" onClick={() => { setDone(false); setForm({ title: '', location: '', date: '', time: '', description: '', registrationLink: '', photos: [] }); }}>
          Créer un autre
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="page-header">
        <div className="page-title">Créer un événement</div>
        <div className="page-subtitle">Remplissez les détails de votre événement</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, padding: '24px 32px', alignItems: 'start' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="form-group">
            <label className="form-label">Nom de l'événement *</label>
            <input className="form-input" placeholder="Nom de l'événement" value={form.title} onChange={e => set('title', e.target.value)} />
            {errors.title && <div className="form-error">{errors.title}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Lieu *</label>
            <input className="form-input" placeholder="Lieu ou 'En ligne (Zoom)'" value={form.location} onChange={e => set('location', e.target.value)} />
            {errors.location && <div className="form-error">{errors.location}</div>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input type="date" className="form-input" value={form.date} onChange={e => set('date', e.target.value)} />
              {errors.date && <div className="form-error">{errors.date}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Heure *</label>
              <input type="time" className="form-input" value={form.time} onChange={e => set('time', e.target.value)} />
              {errors.time && <div className="form-error">{errors.time}</div>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea className="form-textarea" style={{ minHeight: 120 }} placeholder="Parlez-nous de votre événement..." value={form.description} onChange={e => set('description', e.target.value)} />
            {errors.description && <div className="form-error">{errors.description}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Lien d'inscription</label>
            <input className="form-input" placeholder="https://exemple.com/evenement" value={form.registrationLink} onChange={e => set('registrationLink', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Photos</label>
            <div className="upload-zone" onClick={() => document.getElementById('create-file-input').click()}>
              <div className="upload-zone-icon">📷</div>
              <p><span>Cliquez pour uploader</span> ou collez une URL</p>
            </div>
            <input id="create-file-input" type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleFile} />
            <input className="form-input" placeholder="Ou collez l'URL d'une image et appuyez sur Entrée" style={{ marginTop: 8 }}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handlePhotoUrl(e); } }}
              onBlur={handlePhotoUrl}
            />
            {form.photos.length > 0 && (
              <div className="photo-previews">
                {form.photos.map((src, i) => (
                  <div key={i} className="photo-preview">
                    <img src={src} alt="" />
                    <button type="button" className="photo-remove" onClick={() => removePhoto(i)}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Annuler</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Envoi...' : '✦ Soumettre l\'événement'}
            </button>
          </div>
        </form>

        {/* Preview panel */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 18 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Aperçu photos</div>
          {form.photos.length > 0
            ? <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {form.photos.slice(0, 3).map((src, i) => <img key={i} src={src} alt="" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8 }} />)}
              </div>
            : <>
                {PLACEHOLDER_PHOTOS.map((src, i) => <img key={i} src={src} alt="" style={{ width: '100%', height: 88, objectFit: 'cover', borderRadius: 8, marginBottom: 8, opacity: 0.4 }} />)}
                <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>Uploadez des photos pour voir l'aperçu</p>
              </>
          }
        </div>
      </div>
    </>
  );
}
