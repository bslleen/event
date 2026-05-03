import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { PasswordStrength, PasswordInput, isPasswordStrong } from '../components/PasswordStrength';

export default function Login() {
  const [mode, setMode]   = useState('login');
  const [form, setForm]   = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const { addToast }        = useToast();
  const navigate            = useNavigate();

  function set(field, val) { setForm(f => ({ ...f, [field]: val })); setError(''); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (!form.name.trim())          { setError('Nom requis.'); return; }
      if (!form.email.trim())         { setError('Email requis.'); return; }
      if (!isPasswordStrong(form.password)) { setError('Le mot de passe ne respecte pas toutes les conditions.'); return; }
      if (form.password !== form.confirm)   { setError('Les mots de passe ne correspondent pas.'); return; }
      setLoading(true);
      const res = await register(form.name, form.email, form.password);
      setLoading(false);
      if (res.success) { addToast('Compte créé ! Bienvenue !', 'success'); navigate('/'); }
      else setError(res.error);
    } else {
      if (!form.email || !form.password) { setError('Remplissez tous les champs.'); return; }
      setLoading(true);
      const res = await login(form.email, form.password);
      setLoading(false);
      if (res.success) {
        addToast(`Bon retour, ${res.user.name} !`, 'success');
        navigate(res.user.role === 'admin' ? '/admin' : '/');
      } else {
        setError(res.error);
      }
    }
  }

  function switchMode(m) { setMode(m); setForm({ name: '', email: '', password: '', confirm: '' }); setError(''); }

  const confirmMatch    = form.confirm && form.password === form.confirm;
  const confirmMismatch = form.confirm && form.password !== form.confirm;

  return (
    <div className="login-page">
      {/* Left decorative panel */}
      <div className="login-left">
        <div className="login-left-content" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="login-logo-icon" style={{ width: 36, height: 36, fontSize: 16 }}>✦</div>
            <span className="login-logo-text" style={{ fontSize: 20 }}>Eventica</span>
          </div>
        </div>
        <div className="login-left-tagline">
          Découvrez &<br />Partagez des <span className="highlight">Événements</span><br />Incroyables
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)', fontWeight: 400, marginTop: 14, lineHeight: 1.6 }}>
            Trouvez des événements autour de vous et créez les vôtres.<br />Partagez des expériences. Connectez-vous avec les gens.
          </p>
        </div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 24 }}>
          {[['🎵', 'Musique', 'Festivals'], ['💻', 'Tech', 'Conférences'], ['🎨', 'Art', 'Expositions']].map(([icon, l1, l2]) => (
            <div key={l1}>
              <div style={{ fontSize: 22 }}>{icon}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>{l1}<br />{l2}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="login-right">
        <div className="login-box">
          <div className="login-logo">
            <div className="login-logo-icon">✦</div>
            <span className="login-logo-text">Eventica</span>
          </div>

          <div className="login-title">{mode === 'login' ? 'Bon retour !' : 'Créer un compte'}</div>
          <div className="login-subtitle">
            {mode === 'login'
              ? 'Connectez-vous pour découvrir et gérer des événements'
              : 'Rejoignez Eventica pour commencer à partager des événements'}
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Nom d'utilisateur</label>
                <input className="form-input" placeholder="Votre nom d'utilisateur" value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">{mode === 'login' ? 'Nom d\'utilisateur' : 'Adresse email'}</label>
              <input className="form-input" placeholder={mode === 'login' ? 'Votre nom d\'utilisateur' : 'votre@email.com'} value={form.email} onChange={e => set('email', e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <PasswordInput value={form.password} onChange={e => set('password', e.target.value)} />
              {mode === 'register' && <PasswordStrength password={form.password} />}
            </div>

            {mode === 'register' && (
              <>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" placeholder="votre@email.com" value={form.name === form.email ? '' : ''} onChange={e => set('email', e.target.value)} style={{ display: 'none' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirmer le mot de passe</label>
                  <PasswordInput value={form.confirm} onChange={e => set('confirm', e.target.value)} placeholder="••••••••" />
                  {confirmMismatch && <div className="pw-match-err">Les mots de passe ne correspondent pas.</div>}
                  {confirmMatch    && <div className="pw-match-ok">✓ Les mots de passe correspondent</div>}
                </div>
              </>
            )}

            {error && (
              <div className="form-error" style={{ padding: '10px 14px', background: 'rgba(239,68,68,.1)', borderRadius: 8, border: '1px solid rgba(239,68,68,.3)' }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
              {loading ? '...' : mode === 'login' ? '→ Se connecter' : '✦ Créer un compte'}
            </button>
          </form>

          {mode === 'login' && (
            <>
              <div className="login-divider"><span>ou essayer admin</span></div>
              <div className="admin-hint"><strong>Admin :</strong> bouchra / Admin123!</div>
            </>
          )}

          <div className="login-toggle">
            {mode === 'login'
              ? <>Pas de compte ? <button onClick={() => switchMode('register')}>S'inscrire</button></>
              : <>Déjà un compte ? <button onClick={() => switchMode('login')}>Se connecter</button></>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
