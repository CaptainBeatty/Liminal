import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../services/axiosInstance';
import dayjs from 'dayjs';
import Loader from './Loader'; // Importation du Loader
import './PhotoDetails.css'; // Importation du fichier CSS
import { faThumbsUp as faThumbsUpRegular, faThumbsDown as faThumbsDownRegular } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp as faThumbsUpSolid, faThumbsDown as faThumbsDownSolid } from '@fortawesome/free-solid-svg-icons';

const PhotoDetails = ({ currentUserId, onPhotoDeleted, onShowLogin, isLoginOpen }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Gestion du chargement
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCameraType, setNewCameraType] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDate, setNewDate] = useState('');
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

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
        setIsLoading(false); // Chargement terminé
      }
    };

    fetchPhoto();
  }, [id, currentUserId]);

  const handleLike = async () => {
    if (!currentUserId) {
      onShowLogin(); // Ouvre le formulaire Login et modifie le bouton
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
      alert('Erreur lors de l\'ajout du like. Veuillez réessayer.');
    }
  };

  const handleDislike = async () => {
    if (!currentUserId) {
      onShowLogin(); // Ouvre le formulaire Login et modifie le bouton
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
      alert('Erreur lors de l\'ajout du dislike. Veuillez réessayer.');
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

  return (
    <>
      {/* Affichage du Loader */}
      <Loader isVisible={isLoading} />

      {/* Contenu principal masqué tant que le chargement est actif */}
      <div
        style={{
          margin: '10px auto',
          textAlign: 'center',
          maxWidth: '600px',
          display: isLoading ? 'none' : 'block',
        }}
      >
        {/* Icône de retour */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <FontAwesomeIcon
            icon={faChevronLeft}
            onClick={() => navigate(-1)}
            style={{ fontSize: '24px', cursor: 'pointer', marginRight: '10px' }}
            className="chevron-icon" // Classe pour styliser et cacher le chevron
            title="Retour"
          />
          <h1 style={{ textAlign: 'center', margin: 0, flex: 1, fontSize: '25px', fontStyle: 'italic'}}>{photo?.title}</h1>
        </div>

        <div style={{ marginTop: '15px', fontSize: '16px', fontWeight: 'bold' }}>
          <img src={photo?.imageUrl} alt={photo?.title} style={{ width: '100%', borderRadius: '10px' }} />
          <div style={{ marginTop: '10px', fontSize: '14px', fontStyle: 'italic', textAlign: 'center' }}>
            <p>
              {`${photo?.location || 'Lieu non spécifié'} on ${photo?.date ? dayjs(photo.date, 'D MMMM YYYY').format('MMMM DD, YYYY') : 'an unknown date'} by ${photo?.authorName || 'Auteur inconnu'} with ${photo?.cameraType || 'Non spécifié'}`}
            </p>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <button
              onClick={handleLike}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <FontAwesomeIcon
                icon={liked ? faThumbsUpSolid : faThumbsUpRegular}
                style={{ fontSize: '24px', color: liked ? 'black' : '#000' }}
              />
              <span style={{ marginLeft: '8px' }}>{likes}</span>
            </button>
            <button
              onClick={handleDislike}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <FontAwesomeIcon
                icon={disliked ? faThumbsDownSolid : faThumbsDownRegular}
                style={{ fontSize: '24px', color: disliked ? 'black' : '#000' }}
              />
              <span style={{ marginLeft: '8px' }}>{dislikes}</span>
            </button>
          </div>

          {currentUserId === photo?.userId && (
            <div style={{ marginTop: '20px' }}>
              {isEditing ? (
                <div>
                  <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="New title" style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }} />
                  <input type="text" value={newCameraType} onChange={(e) => setNewCameraType(e.target.value)} placeholder="System" style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }} />
                  <input type="text" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} placeholder="Place" style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }} />
                  <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }} />
                  <button onClick={handleUpdate} style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 20px', marginRight: '10px', cursor: 'pointer', borderRadius: '5px' }}>Enregistrer</button>
                  <button onClick={() => setIsEditing(false)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '5px' }}>Annuler</button>
                </div>
              ) : (
                <div>
                  <button onClick={() => setIsEditing(true)} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', marginRight: '10px', cursor: 'pointer', borderRadius: '5px' }}>Modify</button>
                  <button onClick={handleDelete} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '5px' }}>Delete</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PhotoDetails;
