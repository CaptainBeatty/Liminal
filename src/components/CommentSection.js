import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentSection = ({ photoId, currentUserId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [error, setError] = useState(null);
  const isLoggedIn = !!localStorage.getItem('token'); // Vérifie si un token existe
  const token = localStorage.getItem('token'); // Récupère le token de localStorage

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
        setError(null);
      })
      .catch((err) => {
        console.error('Erreur lors de la suppression du commentaire:', err.response?.data || err.message);
        setError('Erreur lors de la suppression du commentaire.');
      });
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '20px' }}>
      <h3>Commentaires</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {comments.length === 0 && <p>Aucun commentaire pour le moment.</p>}
      {comments.map((comment) => (
        <div key={comment._id} style={{ marginBottom: '15px' }}>
          <p>
            <strong>{comment.userId?.username || 'Utilisateur inconnu'}</strong> -{' '}
            {new Date(comment.createdAt).toLocaleString()}
          </p>
          {editingComment?.id === comment._id ? (
            <>
              <textarea
                value={editingComment.content}
                onChange={(e) =>
                  setEditingComment({ id: comment._id, content: e.target.value })
                }
                style={{ width: '100%', marginBottom: '10px' }}
              />
              <button
                onClick={() =>
                  handleEditComment(editingComment.id, editingComment.content)
                }
              >
                Sauvegarder
              </button>
              <button onClick={() => setEditingComment(null)}>Annuler</button>
            </>
          ) : (
            <>
              <p>{comment.content}</p>
              {comment.userId?._id === currentUserId && (
                <div>
                  <button onClick={() => setEditingComment({ id: comment._id, content: comment.content })}>
                    Modifier
                  </button>
                  <button onClick={() => handleDeleteComment(comment._id)}>Supprimer</button>
                </div>
              )}
            </>
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
