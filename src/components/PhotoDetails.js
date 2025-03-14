import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Importez seulement les icônes utilisées
import { faChevronLeft, faSliders, faTrash, faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import {
  faThumbsUp as faThumbsUpRegular,
  faThumbsDown as faThumbsDownRegular,
  faMessage as faMessageRegular
} from '@fortawesome/free-regular-svg-icons';
import {
  faThumbsUp as faThumbsUpSolid,
  faThumbsDown as faThumbsDownSolid
} from '@fortawesome/free-solid-svg-icons';

import axiosInstance from '../services/axiosInstance';
import dayjs from 'dayjs';
import Loader from './Loader';
import Modal from 'react-modal';
import './PhotoDetails.css';

// Lazy load du composant de commentaires
const CommentSectionLazy = React.lazy(() => import('./CommentSection'));

Modal.setAppElement('#root');

function getCloudinaryUrl(baseUrl, { width, quality = 'auto', format = 'auto' } = {}) {
  if (!baseUrl) return '';
  const transformations = [];
  if (width) transformations.push(`w_${width}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);

  const transformationStr = transformations.join(',');

  return baseUrl.replace('/upload/', `/upload/${transformationStr}/`);
}

const PhotoDetails = ({ currentUserId, onPhotoDeleted, onShowLogin }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // States
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
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

  // Effet de flou "dream"
  const [isDreaming, setIsDreaming] = useState(false);

  // Tooltip
  const [showTooltip, setShowTooltip] = useState(false);

  // Récupération des données de la photo
  useEffect(() => {
    async function fetchPhoto() {
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
        setNewDate(photoData.date
          ? dayjs(photoData.date, 'D MMMM YYYY').format('YYYY-MM-DD')
          : ''
        );
      } catch (err) {
        console.error('Erreur lors de la récupération de la photo:', err);
        alert('Erreur lors du chargement de la photo. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchPhoto();
  }, [id, currentUserId]);

  // Effet "dream" une seule fois
  useEffect(() => {
    if (photo) {
      setIsDreaming(true);
      const timer = setTimeout(() => {
        setIsDreaming(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [photo]);

  // Handlers Like / Dislike
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

  // Handlers Modification / Suppression
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
      if (onPhotoDeleted) onPhotoDeleted(id);
      navigate('/');
    } catch (err) {
      console.error('Erreur lors de la suppression de la photo:', err);
      alert('Erreur lors de la suppression de la photo. Veuillez réessayer.');
    }
  };

  const handleModifyClick = () => {
    setIsEditing(prev => !prev);
    setShowDeleteConfirmation(false);
  };

  const handleDeleteIconClick = () => {
    setShowDeleteConfirmation(prev => !prev);
    setIsEditing(false);
  };

  // Commentaires
  const handleToggleComments = () => {
    setShowComments(prev => !prev);
  };

  // Téléchargement
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

  return (
    <>
      <Loader isVisible={isLoading} />
      <div className='picture-area'
        style={{
          
          display: isLoading ? 'none' : 'flex',
        }}
      >
        {/* Header */}
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

        {/* Image principale */}
        <div className="image">
          <div style={{ marginTop: '15px', fontSize: '16px', fontWeight: 'bold', position: 'relative' }}>
            <img
              // On sert une image ~600 px de large, format auto, compression auto:low
              src={getCloudinaryUrl(photo?.imageUrl, {
                width: 600,
                quality: 'auto:low',
                format: 'auto'
              })}
              alt={photo?.title}
              loading="lazy"
              width="600"        // <-- Largeur intrinsèque
              height="400"       // <-- Hauteur intrinsèque (ratio 3:2 par ex.)
              style={{
                maxWidth: '100%', // S'adapte au conteneur
                height: 'auto',
                borderRadius: '10px',
                border: 'solid grey',
                boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                cursor: 'pointer'
              }}
              onClick={() => setIsModalOpen(true)}
              className={isDreaming ? 'dream-effect' : ''}
            />
            {/* Icône de téléchargement sur l'image */}
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
                padding: '5px',
                cursor: 'pointer'
              }}
              title="Télécharger la photo"
            />
          </div>

          {/* Infos sur la photo */}
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
                photo?.date
                  ? dayjs(photo.date, 'D MMMM YYYY').format('MMMM DD, YYYY')
                  : 'an unknown date'
              } by ${photo?.authorName || 'Auteur inconnu'} with ${photo?.cameraType || 'Non spécifié'}`}
            </p>
          </div>

          {/* Modale : version HD */}
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            contentLabel="Image en haute résolution"
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
                overflow: 'hidden',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                background: 'none',
                border: 'none',
              }
            }}
          >
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                // Version plus large pour la modal si souhaité
                src={getCloudinaryUrl(photo?.imageUrl, {
                  width: 1200,
                  quality: 'auto:low',
                  format: 'auto'
                })}
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
        </div>

        {/* Zone "Like" / "Dislike" + Modif / Delete */}
        <div className="button-area">
          <div>
            {/* Like */}
            <button
              onClick={handleLike}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.2)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <FontAwesomeIcon
                icon={liked ? faThumbsUpSolid : faThumbsUpRegular}
                style={{ fontSize: '24px', color: liked ? 'black' : '#000' }}
              />
              <span style={{ marginLeft: '1px' }}>{likes}</span>
            </button>

            {/* Dislike */}
            <button
              onClick={handleDislike}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.2)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <FontAwesomeIcon
                icon={disliked ? faThumbsDownSolid : faThumbsDownRegular}
                style={{ fontSize: '24px', color: disliked ? 'black' : '#000' }}
              />
              <span style={{ marginLeft: '1px' }}>{dislikes}</span>
            </button>
          </div>

          {/* Modif / Delete si propriétaire */}
          {currentUserId === photo?.userId && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '65px',
              }}
            >
              <FontAwesomeIcon
                icon={faSliders}
                style={{
                  fontSize: '24px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                }}
                onClick={handleModifyClick}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.2)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              />
              <FontAwesomeIcon
                icon={faTrash}
                style={{
                  fontSize: '24px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                }}
                onClick={handleDeleteIconClick}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.2)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              />
            </div>
          )}
        </div>

        {/* Confirmation Suppression */}
        {showDeleteConfirmation && (
          <Modal
            isOpen={showDeleteConfirmation}
            onRequestClose={() => setShowDeleteConfirmation(false)}
            contentLabel="Confirmer la suppression"
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
                maxWidth: '400px',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'center',
              },
            }}
          >
            <p style={{ fontStyle: 'italic', color: 'red', marginBottom: '20px' }}>
              Are you sure?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
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
                onClick={() => setShowDeleteConfirmation(false)}
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
          </Modal>
        )}

        {/* Edition Photo */}
        {isEditing && (
          <Modal
            isOpen={isEditing}
            onRequestClose={() => setIsEditing(false)}
            contentLabel="Modifier la photo"
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
            <div>
              <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Modifier la photo</h2>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="New title"
                style={{
                  display: 'block',
                  marginBottom: '10px',
                  padding: '8px',
                  width: '100%',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
              />
              <input
                type="text"
                value={newCameraType}
                onChange={e => setNewCameraType(e.target.value)}
                placeholder="System"
                style={{
                  display: 'block',
                  marginBottom: '10px',
                  padding: '8px',
                  width: '100%',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
              />
              <input
                type="text"
                value={newLocation}
                onChange={e => setNewLocation(e.target.value)}
                placeholder="Place"
                style={{
                  display: 'block',
                  marginBottom: '10px',
                  padding: '8px',
                  width: '100%',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
              />
              <input
                type="date"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                style={{
                  display: 'block',
                  marginBottom: '20px',
                  padding: '8px',
                  width: '100%',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
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
            </div>
          </Modal>
        )}

        {/* Icône d'accès aux commentaires + tooltip */}
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
              Déjà vu?
            </div>
          )}
        </div>

        {/* Section des commentaires en lazy-load */}
        {showComments && (
          <Suspense fallback={<div>Chargement des commentaires...</div>}>
            <CommentSectionLazy
              photoId={id}
              currentUserId={currentUserId}
              onShowLogin={onShowLogin}
            />
          </Suspense>
        )}
      </div>
    </>
  );
};

export default PhotoDetails;
