import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../services/axiosInstance';
import CommentItem from './CommentItem';
import './CommentSection.css';

// Composant générique de modal
const Modal = ({ onClose, children }) => {
  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={modalStyles.closeButton} onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    maxWidth: '500px',
    width: '90%',
    position: 'relative',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '15px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
  },
};

const CommentSection = ({ photoId, currentUserId, onNewReply, onShowLogin }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [showNewCommentModal, setShowNewCommentModal] = useState(false);

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
      const res = await axiosInstance.post(
        '/comments',
        { photoId, content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prevComments) => [res.data, ...prevComments]);
      setNewComment('');
      setShowNewCommentModal(false);
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
      const res = await axiosInstance.post(
        '/comments',
        { 
          photoId, 
          content: `@${parentUsername} ${replyContent}`, 
          parentId 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Réponse ajoutée :", res.data);
      await fetchComments();
      setReplyingTo(null);
      setReplyContent('');
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la réponse:', err);
      setError('Erreur lors de l\'ajout de la réponse.');
    }
  };

  const handleEditComment = async (commentId, updatedContent) => {
    if (!updatedContent.trim()) {
      setError('Le contenu du commentaire ne peut pas être vide.');
      return;
    }
    try {
      await axiosInstance.put(
        `/comments/${commentId}`,
        { content: updatedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
    setReplyingTo((prev) => (prev === commentId ? null : commentId));
  };

  return (
    <div style={{ padding: '10px', marginTop: '10px', textAlign: 'center' }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>loading...</p>}
      {!loading && comments.length === 0 && <p>No comments.</p>}
      {comments.map((comment) => (
        <div key={comment._id}>
          <CommentItem
            comment={comment}
            currentUserId={currentUserId}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
          />
          {isLoggedIn && (
            <button onClick={() => toggleReply(comment._id)} className="reply-button">
              Reply
            </button>
          )}
          {replyingTo === comment._id && (
            <Modal onClose={() => setReplyingTo(null)}>
              <form onSubmit={(e) => handleReplyComment(e, comment._id, comment.userId?.username)}>
                <textarea
                  className='reply-form'
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Your answer..."
                  rows="2"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                  }}
                />
                <div style={{ marginTop: '10px', textAlign: 'right' }}>
                  <button type="submit" className= 'reply-post-button' style={{ marginRight: '10px' }}>
                    Post
                  </button>
                  <button type="button" className= 'cancel-reply-button' onClick={() => setReplyingTo(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            </Modal>
          )}
        </div>
      ))}
      {isLoggedIn ? (
        <div>
          <button onClick={() => setShowNewCommentModal(true)} className="post-button">
            Comment
          </button>
          {showNewCommentModal && (
            <Modal onClose={() => setShowNewCommentModal(false)}>
              <form onSubmit={handleAddComment}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Express yourself..."
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                  }}
                />
                <div style={{ marginTop: '10px', textAlign: 'right' }}>
                  <button type="submit" style={{ marginRight: '10px' }} className="post-button">
                    Post
                  </button>
                </div>
              </form>
            </Modal>
          )}
        </div>
      ) : (
        <p style={{ fontWeight: '700', cursor: 'pointer' }} onClick={onShowLogin}>
          Log in to comment
        </p>
      )}
    </div>
  );
};

export default CommentSection;
