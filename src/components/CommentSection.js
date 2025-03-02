import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../services/axiosInstance';
import CommentItem from './CommentItem';
import './CommentSection.css';

const CommentSection = ({ photoId, currentUserId, onNewReply, onShowLogin }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(`/comments/${photoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(res.data);
    } catch (err) {
      console.error('Erreur lors du chargement des commentaires:', err);
      setError('Impossible de charger les commentaires.');
    } finally {
      setLoading(false);
    }
  }, [photoId, token]);

  useEffect(() => {
    if (!photoId) {
      setError('photoId est requis pour charger les commentaires.');
      return;
    }
    fetchComments();
  }, [photoId, fetchComments]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setError('Le commentaire ne peut pas être vide.');
      return;
    }
    try {
      const res = await axiosInstance.post('/comments', { photoId, content: newComment }, { headers: { Authorization: `Bearer ${token}` } });
      setComments((prevComments) => [res.data, ...prevComments]);
      setNewComment('');
    } catch (err) {
      console.error("Erreur lors de l'ajout du commentaire:", err);
      setError("Erreur lors de l'ajout du commentaire.");
    }
  };

  const handleReplyComment = async (e, parentId, parentUsername) => {
    e.preventDefault();
    if (!replyContent.trim()) {
      setError('La réponse ne peut pas être vide.');
      return;
    }
    try {
      const res = await axiosInstance.post('/comments', { 
        photoId, 
        content: `@${parentUsername} ${replyContent}`, 
        parentId 
      }, { headers: { Authorization: `Bearer ${token}` } });
  
      console.log("Réponse ajoutée :", res.data); // 🔍 Debugging
  
      // 🔥 FORCER LE RE-RENDER EN RECHARGEANT TOUT
      await fetchComments();
  
      setReplyingTo(null);
      setReplyContent('');
    } catch (err) {
      console.error(`Erreur lors de l'ajout de la réponse:`, err);
      setError(`Erreur lors de l'ajout de la réponse.`);
    }
  };
  
  
  
  const handleEditComment = async (commentId, updatedContent) => {
    if (!updatedContent.trim()) {
      setError('Le contenu du commentaire ne peut pas être vide.');
      return;
    }
    try {
      await axiosInstance.put(`/comments/${commentId}`, { content: updatedContent }, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
  
      setComments((prevComments) => 
        prevComments.map((c) => (c._id === commentId ? { ...c, content: updatedContent } : c))
      );
    } catch (err) {
      console.error('Erreur lors de la modification du commentaire:', err);
      setError('Erreur lors de la modification du commentaire.');
    }
  };
  
  const handleDeleteComment = async (commentId) => {
    try {
      await axiosInstance.delete(`/comments/${commentId}`, { headers: { Authorization: `Bearer ${token}` } });
      setComments((prevComments) => prevComments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error('Erreur lors de la suppression du commentaire:', err);
      setError('Erreur lors de la suppression du commentaire.');
    }
  };

  const toggleReply = (commentId) => {
    setReplyingTo(prev => (prev === commentId ? null : commentId));
  };
  

  return (
    <div style={{ padding: '10px', marginTop: '10px' }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Chargement des commentaires...</p>}
      {!loading && comments.length === 0 && <p>Aucun commentaire.</p>}
      {comments.map((comment) => (
        <div key={comment._id}>
          <CommentItem
            comment={comment}
            currentUserId={currentUserId}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
          />
          {isLoggedIn && (
            <button onClick={() => toggleReply(comment._id)} className="reply-button">Reply</button>
          )}
          {replyingTo === comment._id && (
            <form onSubmit={(e) => handleReplyComment(e, comment._id, comment.userId?.username)} className="reply-form">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Reply..."
                rows="2"
                className="reply-textarea"
              />
              <div className="reply-buttons">
              <button type="submit" className="reply-post-button">Envoyer</button>
              <button onClick={() => setReplyingTo(null)} className="cancel-reply-button">Annuler</button>
              </div>
            </form>
          )}
        </div>
      ))}
      {isLoggedIn ? (
        <form onSubmit={handleAddComment}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="My thinking..."
            rows="4"
            className="new-comment-textarea"
          />
          <button type="submit" className="post-button">Poster</button>
        </form>
      ) : (
        <p
          style={{ fontWeight: '700', cursor: 'pointer' }}
          onClick={onShowLogin}
        >
          Log in to comment
        </p>
      )}
    </div>
  );
};

export default CommentSection;
