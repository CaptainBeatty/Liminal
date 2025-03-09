import React from 'react';
import './Modal.css';

const Modal = ({ children, isOpen, onClose }) => {
  // Si la prop isOpen est false, on ne rend rien (modal fermé)
  if (!isOpen) return null;

  // Fermer le modal si on clique sur l'overlay (zone grisée)
  const handleOverlayClick = (event) => {
    // Si le clic provient directement de l'overlay (pas du contenu interne)
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        {/* Bouton de fermeture dans le coin */}
        <button className="modal-close" onClick={onClose}>X</button>
        
        {/* Contenu du modal (votre formulaire, etc.) */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
