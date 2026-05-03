import React, { useState, useEffect } from 'react';

const PLACEHOLDER_PHOTOS = [
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
  'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&q=80',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
  'https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=600&q=80',
];

const IconX = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const EMPTY = { title: '', location: '', date: '', time: '', description: '', registrationLink: '', photos: [] };

export default function CreateEventModal({ isOpen, onClose, onSubmit, initial }) {
  const [form, setForm]   = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) { setForm(initial ? { ...EMPTY, ...initial } : EMPTY); setErrors({}); }
  }, [isOpen, initial]);

  if (!isOpen) return null;

  function set(field, val) { setForm(f => ({ ...f, [field]: val })); if (errors[field]) setErrors(e => ({ ...e, [field]: '' })); }

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

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const photos = form.photos.length ? form.photos : [PLACEHOLDER_PHOTOS[Math.floor(Math.random() * PLACEHOLDER_PHOTOS.length)]];
    onSubmit({ ...form, photos });
  }

  function handlePhotoUrl(e) {
    const url = e.target.value.trim();
    if (url && url.startsWith('http')) { set('photos', [...form.photos, url]); e.target.value = ''; }
  }

  function removePhoto(i) { set('photos', form.photos.filter((_, j) => j !== i)); }

  function handleFile(e) {
    Array.from(e.target.files).forEach(f => {
      const r = new FileReader();
      r.onload = ev => setForm(p => ({ ...p, photos: [...p.photos, ev.target.result] }));
      r.readAsDataURL(f);
    });
    e.target.value = '';
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={ev => ev.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{initial ? 'Modifier l\'événement' : 'Créer un événement'}</div>
          <button className="btn-icon" onClick={onClose}><IconX /></button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
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
            <textarea className="form-textarea" placeholder="Parlez-nous de votre événement..." value={form.description} onChange={e => set('description', e.target.value)} />
            {errors.description && <div className="form-error">{errors.description}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Lien d'inscription</label>
            <input className="form-input" placeholder="https://exemple.com/evenement" value={form.registrationLink} onChange={e => set('registrationLink', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Photos</label>
            <div className="upload-zone" onClick={() => document.getElementById('modal-file-input').click()}>
              <div className="upload-zone-icon">🖼</div>
              <p><span>Cliquez pour uploader</span> ou collez une URL</p>
            </div>
            <input id="modal-file-input" type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleFile} />
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
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn btn-primary">✦ {initial ? 'Enregistrer' : 'Soumettre'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
