import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentSection = ({ photoId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [error, setError] = useState(null);

  // Récupération du token depuis le stockage local
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!photoId) {
      setError('photoId est requis pour charger les commentaires.');
      return;
    }

    axios
      .get(`http://localhost:5000/api/comments/${photoId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Ajout du token dans les headers
        },
      })
      .then((res) => {
        setComments(res.data);
        setError(null); // Efface les erreurs éventuelles
      })
      .catch((err) => {
        console.error('Erreur lors du chargement des commentaires:', err.response?.data || err.message);
        setError('Impossible de charger les commentaires.');
      });
  }, [photoId, token]);

  const handleKeyDown = (e) => {
    // Empêche le comportement par défaut de la touche Espace uniquement hors champs texte
    if (e.key === ' ' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'INPUT') {
      e.preventDefault();
      e.stopPropagation();
      console.log('Espace intercepté dans CommentSection.');
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();

    if (!photoId) {
      console.error('photoId est requis pour ajouter un commentaire.');
      setError('photoId est requis pour ajouter un commentaire.');
      return;
    }

    if (!newComment.trim()) {
      console.error('Erreur : Le champ de commentaire est vide.');
      setError('Le commentaire ne peut pas être vide.');
      return;
    }

    axios
      .post(
        'http://localhost:5000/api/comments',
        { photoId, content: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ajout du token dans les headers
          },
        }
      )
      .then((res) => {
        setComments([...comments, res.data]); // Ajoute le nouveau commentaire à la liste
        setNewComment(''); // Réinitialise le champ
        setError(null); // Efface les erreurs éventuelles
      })
      .catch((err) => {
        console.error('Erreur lors de l\'ajout du commentaire:', err.response?.data || err.message);
        setError('Erreur lors de l\'ajout du commentaire.');
      });
  };

  const handleEditComment = (commentId, newContent) => {
    if (!newContent.trim()) {
      console.error('Erreur : Le contenu du commentaire est vide.');
      setError('Le contenu du commentaire ne peut pas être vide.');
      return;
    }

    axios
      .put(
        `http://localhost:5000/api/comments/${commentId}`,
        { content: newContent },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ajout du token dans les headers
          },
        }
      )
      .then((res) => {
        setComments(comments.map((c) => (c._id === commentId ? res.data : c))); // Met à jour le commentaire modifié
        setEditingComment(null); // Sort du mode édition
        setError(null); // Efface les erreurs éventuelles
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
          Authorization: `Bearer ${token}`, // Ajout du token dans les headers
        },
      })
      .then(() => {
        setComments(comments.filter((c) => c._id !== commentId)); // Supprime le commentaire localement
        setError(null); // Efface les erreurs éventuelles
      })
      .catch((err) => {
        console.error('Erreur lors de la suppression du commentaire:', err.response?.data || err.message);
        setError('Erreur lors de la suppression du commentaire.');
      });
  };

  if (!photoId) {
    return <p>Erreur : ID de la photo introuvable.</p>;
  }

  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '10px',
        marginTop: '20px',
      }}
      tabIndex={0} // Rend la section focusable pour capturer les événements clavier
      onKeyDown={handleKeyDown} // Intercepte les événements clavier
      onClick={(e) => e.stopPropagation()} // Empêche la fermeture par clic
    >
      <h3>Commentaires</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Affiche les erreurs */}
      {comments.length === 0 && <p>Aucun commentaire pour le moment.</p>}
      {comments.map((comment) => (
        <div key={comment._id} style={{ marginBottom: '15px' }}>
          <p>
            <strong>{comment.userName}</strong> - {new Date(comment.createdAt).toLocaleString()}
          </p>
          <p>{comment.content}</p>
          {comment.userId === /* currentUserId */ '12345' && (
            <div>
              {editingComment === comment._id ? (
                <>
                  <textarea
                    defaultValue={comment.content}
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
                  <button onClick={() => setEditingComment(comment._id)}>Modifier</button>
                  <button onClick={() => handleDeleteComment(comment._id)}>Supprimer</button>
                </>
              )}
            </div>
          )}
        </div>
      ))}
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
    </div>
  );
};

export default CommentSection;
