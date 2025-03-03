import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faSliders, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as faThumbsUpRegular, faThumbsDown as faThumbsDownRegular } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp as faThumbsUpSolid, faThumbsDown as faThumbsDownSolid } from '@fortawesome/free-solid-svg-icons';
import { faMessage as faMessageRegular } from '@fortawesome/free-regular-svg-icons'; // <-- si vous souhaitez l'import explicite
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';

import axiosInstance from '../services/axiosInstance';
import dayjs from 'dayjs';
import Loader from './Loader';
import CommentSection from './CommentSection';
import Modal from 'react-modal';
import './PhotoDetails.css';

Modal.setAppElement('#root');

const PhotoDetails = ({ currentUserId, onPhotoDeleted, onShowLogin, onClose }) => {
  const { id } = useParams();
  const { id: photoId } = useParams(); 
  const navigate = useNavigate();

  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCameraType, setNewCameraType] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDate, setNewDate] = useState('');
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isDreaming, setIsDreaming] = useState(false);
  

  // --> Ajout d'un state pour le tooltip
  const [showTooltip, setShowTooltip] = useState(false);

  
  useEffect(() => {
    
    const fetchPhoto = async () => {
      try {
        const res = await axiosInstance.get(`/photos/${id}`);
        const photoData = res.data;

        setPhoto(photoData);
        setNewTitle(photoData.title);
        setNewCameraType(photoData.cameraType || '');
        setNewLocation(photoData.location || '');
        setLikes(photoData.likes || 0);
        setDislikes(photoData.dislikes || 0);
        setLiked(photoData.likedBy?.includes(currentUserId));
        setDisliked(photoData.dislikedBy?.includes(currentUserId));
        setNewDate(
          photoData.date
            ? dayjs(photoData.date, 'D MMMM YYYY').format('YYYY-MM-DD')
            : ''
        );
      } catch (err) {
        console.error('Erreur lors de la récupération de la photo:', err);
        alert('Erreur lors du chargement de la photo. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhoto();
  }, [id, currentUserId]);

  const handleLike = async () => {
    if (!currentUserId) {
      onShowLogin();
      return;
    }
    try {
      const response = await axiosInstance.post(`/photos/${id}/like`);
      setLikes(response.data.likes);
      setDislikes(response.data.dislikes);
      setLiked(!liked);
      setDisliked(false);
    } catch (err) {
      console.error('Erreur lors du like:', err);
      alert("Erreur lors de l'ajout du like. Veuillez réessayer.");
    }
  };

  const handleDislike = async () => {
    if (!currentUserId) {
      onShowLogin();
      return;
    }
    try {
      const response = await axiosInstance.post(`/photos/${id}/dislike`);
      setLikes(response.data.likes);
      setDislikes(response.data.dislikes);
      setDisliked(!disliked);
      setLiked(false);
    } catch (err) {
      console.error('Erreur lors du dislike:', err);
      alert("Erreur lors de l'ajout du dislike. Veuillez réessayer.");
    }
  };

  const handleUpdate = async () => {
    try {
      if (!dayjs(newDate, 'YYYY-MM-DD', true).isValid()) {
        alert('Veuillez entrer une date valide (AAAA-MM-JJ).');
        return;
      }

      const formData = new FormData();
      formData.append('title', newTitle || photo.title);
      formData.append('cameraType', newCameraType || photo.cameraType);
      formData.append('location', newLocation || photo.location);
      formData.append('date', dayjs(newDate, 'YYYY-MM-DD').format('D MMMM YYYY'));

      await axiosInstance.put(`/photos/${id}`, formData);
      alert('Photo mise à jour avec succès.');

      const updatedPhoto = await axiosInstance.get(`/photos/${id}`);
      setPhoto(updatedPhoto.data);

      setIsEditing(false);
    } catch (err) {
      console.error('Erreur lors de la modification de la photo:', err);
      alert('Erreur lors de la modification de la photo. Veuillez réessayer.');
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/photos/${id}`);
      alert('Photo supprimée avec succès.');

      if (onPhotoDeleted) {
        onPhotoDeleted(id);
      }

      navigate('/');
    } catch (err) {
      console.error('Erreur lors de la suppression de la photo:', err);
      alert('Erreur lors de la suppression de la photo. Veuillez réessayer.');
    }
  };

  const handleModifyClick = () => {
    setIsModifying(true);
    setIsEditing((prevIsEditing) => !prevIsEditing);
    setShowDeleteConfirmation(false);
    if (!isEditing) {
      setTimeout(() => setIsModifying(false), 500);
    }
  };

  const handleDeleteIconClick = () => {
    setShowDeleteConfirmation((prevShowDeleteConfirmation) => !prevShowDeleteConfirmation);
    setIsEditing(false);
  };

  // --> Reste inchangé, sauf qu'on ne liera plus ce toggle à un bouton texte, mais à l'icône
  const handleToggleComments = () => {
    setShowComments((prev) => !prev);
  };

  const handleDownload = async () => {
  try {
    const response = await fetch(photo?.imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = photo?.title || 'photo';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Erreur lors du téléchargement", err);
    alert("Une erreur est survenue lors du téléchargement.");
  }
};
useEffect(() => {
  // Déclenche l'effet aléatoirement toutes les 2 secondes (chance de 30%)
  const interval = setInterval(() => {
    if (Math.random() < 0.3) {
      setIsDreaming(true);
      // Réinitialise l'état après la durée de l'animation (2s)
      setTimeout(() => setIsDreaming(false), 1000);
    }
  }, 2000);
  return () => clearInterval(interval);
}, []);

  

  return (
    <>
      <Loader isVisible={isLoading} />

      <div
        style={{
          margin: '10px auto',
          textAlign: 'center',
          maxWidth: '600px',
          display: isLoading ? 'none' : 'block',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
          <FontAwesomeIcon
            icon={faChevronLeft}
            onClick={() => navigate(-1)}
            style={{ cursor: 'pointer', marginRight: '10px' }}
            className="chevron-icon"
            title="Retour"
          />
          <h1 style={{ textAlign: 'center', margin: 0, flex: 1, fontSize: '25px', fontStyle: 'italic' }}>
            {photo?.title}
          </h1>
        </div>
        <div className='image'>
          <div style={{ marginTop: '15px', fontSize: '16px', fontWeight: 'bold', position: 'relative' }}>
            <img
              src={photo?.imageUrl}
              alt={photo?.title}
              style={{
                width: '100%',
                borderRadius: '10px',
                border: 'solid grey',
                boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                cursor: 'pointer' 
              }}
                onClick={() => setIsModalOpen(true)}
                className={isDreaming ? 'dream-effect' : ''}
          />
           <FontAwesomeIcon
              icon={faArrowUpFromBracket}
              onClick={handleDownload}
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  fontSize: '20px',
                  color: 'white',
                  backgroundColor: 'transparent',
                  // borderRadius: '50%',
                  padding: '5px',
                  cursor: 'pointer'
                }}
                  title="Télécharger la photo"
              />
        </div>
          <div 
            style={{
              marginTop: '10px',
              fontSize: '14px',
              fontStyle: 'italic',
              textAlign: 'center',
              justifyContent: 'center'
            }}
          >
            <p>
              {`${photo?.location || 'Lieu non spécifié'} on ${
                photo?.date ? dayjs(photo.date, 'D MMMM YYYY').format('MMMM DD, YYYY') : 'an unknown date'
              } by ${photo?.authorName || 'Auteur inconnu'} with ${photo?.cameraType || 'Non spécifié'}`}
            </p>
          </div>
          <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Image en haute résolution"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 1000,
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            background: 'none',
            border: 'none',
          }
        }}
      >
        <div >
          <img
            src={photo?.imageUrl}
            alt={photo?.title}
            style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '10px' }}
          />
              <FontAwesomeIcon
                icon={faArrowUpFromBracket}
                onClick={handleDownload}
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  right: '20px',
                  fontSize: '20px',
                  color: 'white',
                  backgroundColor: 'transparent',
                  // borderRadius: '50%',
                  padding: '5px',
                  cursor: 'pointer'
                }}
                title="Télécharger la photo"
              />
          {/* Bouton de fermeture */}
          <button
            onClick={() => setIsModalOpen(false)}
            style={{
              position: 'absolute',
              top: '30px',
              right: '30px',
              background: 'rgba(0,0,0,0.5)',
              border: 'none',
              color: 'white',
              fontStyle: 'italic',
              padding: '5px 10px',
              cursor: 'pointer',
              borderRadius: '5px'
            }}
          >
            Fermer
          </button>
        </div>
      </Modal>

          <div className='button-area'>
            <div>
              <button
                onClick={handleLike}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <FontAwesomeIcon
                  icon={liked ? faThumbsUpSolid : faThumbsUpRegular}
                  style={{ fontSize: '24px', color: liked ? 'black' : '#000' }}
                />
                <span style={{ marginLeft: '1px' }}>{likes}</span>
              </button>
              <button
                onClick={handleDislike}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <FontAwesomeIcon
                  icon={disliked ? faThumbsDownSolid : faThumbsDownRegular}
                  style={{ fontSize: '24px', color: disliked ? 'black' : '#000' }}
                />
                <span style={{ marginLeft: '1px' }}>{dislikes}</span>
              </button>
            </div>

            {currentUserId === photo?.userId && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '65px',
                }}
              >
                <>
                  <FontAwesomeIcon
                    icon={isModifying ? faSliders : faSliders}
                    style={{
                      fontSize: '24px',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                    }}
                    onClick={handleModifyClick}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    style={{
                      fontSize: '24px',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                    }}
                    onClick={handleDeleteIconClick}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                </>
              </div>
            )}
          </div>

          {showDeleteConfirmation && (
            <div
              className="delete-confirmation"
              style={{ marginTop: '10px', marginBottom: '10px', textAlign: 'center' }}
            >
              <p style={{ fontStyle: 'italic', color: 'red' }}>Are you sure?</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                <button
                  onClick={handleDelete}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '8px 20px',
                    cursor: 'pointer',
                    borderRadius: '5px',
                    fontStyle: 'italic',
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={handleDeleteIconClick}
                  style={{
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '8px 20px',
                    cursor: 'pointer',
                    borderRadius: '5px',
                    fontStyle: 'italic',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {isEditing && (
            <div>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="New title"
                style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%', borderRadius: '5px' }}
              />
              <input
                type="text"
                value={newCameraType}
                onChange={(e) => setNewCameraType(e.target.value)}
                placeholder="System"
                style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%', borderRadius: '5px' }}
              />
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Place"
                style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%', borderRadius: '5px' }}
              />
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%', borderRadius: '5px' }}
              />
              <button
                onClick={handleUpdate}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  marginRight: '10px',
                  cursor: 'pointer',
                  borderRadius: '5px',
                }}
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  borderRadius: '5px',
                }}
              >
                Cancel
              </button>
              
            </div>
          )}
        </div>

        {/* Remplacement du bouton par l'icône avec tooltip */}
        <div
          onClick={handleToggleComments}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          style={{
            marginTop: '20px',
            display: 'inline-block',
            position: 'relative',
            cursor: 'pointer',
          }}
        >
          <FontAwesomeIcon
            icon={faMessageRegular}
            style={{ fontSize: '20px', color: '#000' }}
          />
          {showTooltip && (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                bottom: '-30px',
                backgroundColor: 'black',
                color: 'white',
                padding: '5px 8px',
                borderRadius: '4px',
                whiteSpace: 'nowrap',
                zIndex: 999,
                fontSize: '13px',
              }}
            >
              Déja vu?
            </div>
          )}
        </div>

        {/* Affichage conditionnel de la section des commentaires */}
        {showComments && (
          <CommentSection
            photoId={photoId}
            currentUserId={currentUserId}
            onShowLogin={onShowLogin}  // Ajout de la prop pour déclencher le formulaire de login
          />
        )}
      </div>
    </>
  );
};

export default PhotoDetails;
