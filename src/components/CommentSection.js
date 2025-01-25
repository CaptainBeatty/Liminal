import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

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

    axios
      .get(`http://localhost:5000/api/comments/${photoId}`, {
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

    axios
      .post(
        'http://localhost:5000/api/comments',
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

    axios
      .put(
        `http://localhost:5000/api/comments/${commentId}`,
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
    axios
      .delete(`http://localhost:5000/api/comments/${commentId}`, {
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
    <div style={{ padding: '10px', marginTop: '20px' }}>
      <h3>What are you thinking about?</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {comments.length === 0 && <p>Aucun commentaire pour le moment.</p>}
      {comments.map((comment) => (
        <div key={comment._id} style={{ marginBottom: '15px', position: 'relative' }}>
          <p>
            <strong>{comment.userId?.username || 'Utilisateur inconnu'}</strong> -{' '}
            {new Date(comment.createdAt).toLocaleString()}
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {editingComment?.id === comment._id ? (
              <>
                <textarea
                  value={editingComment.content}
                  onChange={(e) =>
                    setEditingComment({ id: comment._id, content: e.target.value })
                  }
                  style={{ flex: 1, marginRight: '10px' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', marginRight: '10px' }}>
                  <button
                    onClick={() => handleEditComment(editingComment.id, editingComment.content)}
                    style={{ marginRight: '5px' }}
                  >
                    Sauvegarder
                  </button>
                  <button onClick={() => setEditingComment(null)}>Annuler</button>
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
            <div
              ref={menuRef}
              style={{
                position: 'absolute',
                top: '80px',
                right: '0',
                border: '1px solid #ccc',
                backgroundColor: '#fff',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                zIndex: 10,
              }}
            >
              <button
                onClick={() => {
                  setEditingComment({ id: comment._id, content: comment.content });
                  setMenuOpen(null);
                }}
                style={{ display: 'block', padding: '10px', width: '100%' }}
              >
                Modifier
              </button>
              <button
                onClick={() => {
                  handleDeleteComment(comment._id);
                  setMenuOpen(null);
                }}
                style={{ display: 'block', padding: '10px', width: '100%' }}
              >
                Supprimer
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
            placeholder="Ajouter un commentaire..."
            rows="4"
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <button type="submit">Envoyer</button>
        </form>
      ) : (
        <p>Connectez-vous pour laisser un commentaire.</p>
      )}
    </div>
  );
};

export default CommentSection;
