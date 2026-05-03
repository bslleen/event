import React, { useState } from 'react';

const RULES = [
  { label: 'Au moins 8 caractères',        test: p => p.length >= 8 },
  { label: 'Lettre majuscule (A-Z)',        test: p => /[A-Z]/.test(p) },
  { label: 'Lettre minuscule (a-z)',        test: p => /[a-z]/.test(p) },
  { label: 'Chiffre (0-9)',                 test: p => /[0-9]/.test(p) },
  { label: 'Caractère spécial (!@#$…)',     test: p => /[^A-Za-z0-9]/.test(p) },
];

const COLORS = ['#ef4444', '#f59e0b', '#f59e0b', '#10b981', '#10b981'];
const LABELS  = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];

export function PasswordStrength({ password }) {
  if (!password) return null;
  const score = RULES.filter(r => r.test(password)).length;
  const color = COLORS[score - 1] || '#ef4444';
  const label = LABELS[score - 1] || 'Très faible';

  return (
    <div>
      <div className="pw-bar">
        <div className="pw-bar-fill" style={{ width: `${score * 20}%`, background: color }} />
      </div>
      <div className="pw-score-row">
        <span className="pw-score-label" style={{ color }}>{label}</span>
        <span className="pw-score-num">{score}/5</span>
      </div>
      <div className="pw-rules">
        {RULES.map(r => {
          const ok = r.test(password);
          return (
            <div key={r.label} className={`pw-rule ${ok ? 'ok' : ''}`}>
              <div className="pw-rule-dot" />
              {ok ? '✓ ' : ''}{r.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Wrapper input with show/hide toggle */
export function PasswordInput({ value, onChange, placeholder = '••••••••', id }) {
  const [show, setShow] = useState(false);
  return (
    <div className="pw-input-wrap">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        className="form-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <button type="button" className="pw-toggle" onClick={() => setShow(s => !s)} tabIndex={-1}>
        {show ? '🙈' : '👁'}
      </button>
    </div>
  );
}

export function isPasswordStrong(password) {
  return RULES.every(r => r.test(password));
}
