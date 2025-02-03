import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import useOutsideClick from '../hooks/useOutsideClick';
import './CommentItem.css';


const CommentItem = ({ comment, currentUserId, onEditComment, onDeleteComment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useOutsideClick(menuRef, buttonRef, () => setMenuOpen(false));

  const handleSave = async () => {
    if (editContent.trim()) {
      await onEditComment(comment._id, editContent);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    await onDeleteComment(comment._id);
  };

  const formattedDate = new Date(comment.createdAt).toLocaleString();

  return (
    <div style={{ position: 'relative' }}>
      <p style={{ marginTop: 0, marginBottom: '0 rem'}}>
        <strong>{comment.userId?.username || 'Utilisateur inconnu'}</strong> – {formattedDate}
      </p>
      {isEditing ? (
        <div>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="comment-edit-textarea"
          />
          <div className="comment-edit-buttons">
            <button onClick={handleSave} className="save-button">Enregistrer</button>
            <button onClick={() => setIsEditing(false)} className="cancel-button">Annuler</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ flex: 1, wordWrap: 'break-word', overflowWrap: 'break-word', maxWidth: '100%', whiteSpace: 'pre-wrap' }}>{comment.content}</p>
          {comment.userId?._id === currentUserId && (
            <>
              <button
                ref={buttonRef}
                onClick={() => setMenuOpen((prev) => !prev)}
                className="menu-button"
                style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                <FontAwesomeIcon icon={faEllipsis} />
              </button>
            </>
          )}
        </div>
      )}
      {menuOpen && (
        <div ref={menuRef} className="comment-style">
          <button onClick={() => { setIsEditing(true); setMenuOpen(false); }} style={{ display: 'block', padding: '10px', width: '100%' }}>Modifier</button>
          <button onClick={handleDelete} style={{ display: 'block', padding: '10px', width: '100%' }}>Supprimer</button>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
