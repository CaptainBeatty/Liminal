import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import useOutsideClick from '../hooks/useOutsideClick';
import './CommentItem.css';

Modal.setAppElement('#root');

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
      <p style={{ marginTop: 0, marginBottom: '0rem' }}>
        <strong>{comment.userId?.username || 'Utilisateur inconnu'}</strong> – {formattedDate}
      </p>
      <div className="text-ellipse-button">
        <p
          style={{
            flex: 1,
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            maxWidth: '100%',
            whiteSpace: 'pre-wrap'
          }}
        >
          {comment.content}
        </p>
        {comment.userId?._id === currentUserId && (
          <button
            ref={buttonRef}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="menu-button"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            <FontAwesomeIcon icon={faEllipsis} />
          </button>
        )}
      </div>

      {menuOpen && (
        <div ref={menuRef} className="comment-style">
          <button
            onClick={() => {
              setIsEditing(true);
              setMenuOpen(false);
            }}
            style={{ display: 'block', padding: '10px', width: '100%' }}
          >
            Modify
          </button>
          <button
            onClick={handleDelete}
            style={{ display: 'block', padding: '10px', width: '100%' }}
          >
            Delete
          </button>
        </div>
      )}

      {/* Modal pour l'édition du commentaire */}
      <Modal
        isOpen={isEditing}
        onRequestClose={() => setIsEditing(false)}
        contentLabel="Modify"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 1500,
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '500px',
            padding: '20px',
            borderRadius: '10px',
          },
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Modify</h2>
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="comment-edit-textarea"
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            marginBottom: '20px'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button onClick={handleSave} className="save-button">Save</button>
          <button onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default CommentItem;
