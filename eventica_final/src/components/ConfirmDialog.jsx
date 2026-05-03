import React from 'react';

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Supprimer', confirmClass = 'btn-danger' }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal confirm-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-body">
          <div className="confirm-icon">⚠️</div>
          <div className="confirm-title">{title}</div>
          <div className="confirm-text">{message}</div>
          <div className="confirm-actions">
            <button className="btn btn-secondary" onClick={onCancel}>Annuler</button>
            <button className={`btn ${confirmClass}`} onClick={onConfirm}>{confirmLabel}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
