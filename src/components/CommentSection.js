import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../services/axiosInstance';
import './CommentSection.css'; 

const CommentSection = ({ photoId, currentUserId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null); // Stocke l'état du commentaire en cours d'édition
  const [menuOpen, setMenuOpen] = useState(null); // ID du menu ouvert
  const [error, setError] = useState(null);
  const isLoggedIn = !!localStorage.getItem('token');
  const token = localStorage.getItem('token');
  const menuRef = useRef(null); // Référence pour le menu déroulant
  const buttonRef = useRef(null); // Référence pour détecter les clics sur le bouton

  useEffect(() => {
    if (!photoId) {
      setError('photoId est requis pour charger les commentaires.');
      return;
    }

    axiosInstance
      .get(`/comments/${photoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setComments(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error('Erreur lors du chargement des commentaires:', err.response?.data || err.message);
        setError('Impossible de charger les commentaires.');
      });
  }, [photoId, token]);

  const handleAddComment = (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      setError('Le commentaire ne peut pas être vide.');
      return;
    }

    axiosInstance
      .post(
        '/comments',
        { photoId, content: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setComments([...comments, res.data]);
        setNewComment('');
        setError(null);
      })
      .catch((err) => {
        console.error('Erreur lors de l\'ajout du commentaire:', err.response?.data || err.message);
        setError('Erreur lors de l\'ajout du commentaire.');
      });
  };

  const handleEditComment = (commentId, updatedContent) => {
    if (!updatedContent.trim()) {
      setError('Le contenu du commentaire ne peut pas être vide.');
      return;
    }

    axiosInstance
      .put(
        `/comments/${commentId}`,
        { content: updatedContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setComments(comments.map((c) => (c._id === commentId ? res.data : c)));
        setEditingComment(null);
        setError(null);
      })
      .catch((err) => {
        console.error('Erreur lors de la modification du commentaire:', err.response?.data || err.message);
        setError('Erreur lors de la modification du commentaire.');
      });
  };

  const handleDeleteComment = (commentId) => {
    axiosInstance
      .delete(`/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setComments(comments.filter((c) => c._id !== commentId));
        setMenuOpen(null);
        setError(null);
      })
      .catch((err) => {
        console.error('Erreur lors de la suppression du commentaire:', err.response?.data || err.message);
        setError('Erreur lors de la suppression du commentaire.');
      });
  };

  const handleMenuToggle = (commentId) => {
    setMenuOpen((prev) => (prev === commentId ? null : commentId)); // Inverse l'état
  };

  const handleOutsideClick = (e) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(e.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(e.target)
    ) {
      setMenuOpen(null); // Ferme le menu si clic en dehors
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div style={{ padding: '10px', marginTop: '10px' }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {comments.length === 0 && <p>No comments.</p>}
      {comments.map((comment) => (
        <div key={comment._id} style={{ marginBottom: '15px', position: 'relative' }}>
          <p>
            <strong>{comment.userId?.username || 'Utilisateur inconnu'}</strong> -{' '}
            {new Date(comment.createdAt).toLocaleString()}
          </p>
          <div className='comments'
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection : 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {editingComment?.id === comment._id ? (
              <>
                <textarea
                  value={editingComment.content}
                  onChange={(e) =>
                    setEditingComment({ id: comment._id, content: e.target.value })
                  }
                  className="comment-edit-textarea"
                />
                <div className="comment-edit-buttons">
                  <button
                    onClick={() => handleEditComment(editingComment.id, editingComment.content)}
                    className="save-button"
                  >
                    Save
                  </button>
                  <button onClick={() => setEditingComment(null)} className="cancel-button">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p
                  style={{
                    flex: 1,
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    maxWidth: '100%',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {comment.content}
                </p>
                {comment.userId?._id === currentUserId && (
                  <button
                    ref={menuOpen === comment._id ? buttonRef : null}
                    onClick={() => handleMenuToggle(comment._id)}
                    className="menu-button"
                    style={{
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <FontAwesomeIcon icon={faEllipsis} />
                  </button>
                )}
              </>
            )}
          </div>
          {menuOpen === comment._id && (
            <div className='comment-style'
              ref={menuRef}
            >
              <button
                onClick={() => {
                  setEditingComment({ id: comment._id, content: comment.content });
                  setMenuOpen(null);
                }}
                style={{ display: 'block', padding: '10px', width: '100%' }}
              >
                Modify
              </button>
              <button
                onClick={() => {
                  handleDeleteComment(comment._id);
                  setMenuOpen(null);
                }}
                style={{ display: 'block', padding: '10px', width: '100%' }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
      {isLoggedIn ? (
        <form onSubmit={handleAddComment}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Tell us..."
            rows="4"
            className="new-comment-textarea"
          />
          <button type="submit" className="post-button">Post</button>
        </form>
      ) : (
        <p>Please login to post.</p>
      )}
    </div>
  );
};

export default CommentSection;
