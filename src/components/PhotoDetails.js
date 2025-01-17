import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../services/axiosInstance';
import dayjs from 'dayjs';
import Loader from './Loader'; // Importation du Loader
import './PhotoDetails.css'; // Importation du fichier CSS

const PhotoDetails = ({ currentUserId, onPhotoDeleted }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Gestion du chargement
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCameraType, setNewCameraType] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDate, setNewDate] = useState('');

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const res = await axiosInstance.get(`/photos/${id}`);
        const photoData = res.data;

        setPhoto(photoData);
        setNewTitle(photoData.title);
        setNewCameraType(photoData.cameraType || '');
        setNewLocation(photoData.location || '');
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
  }, [id]);

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
          margin: '20px auto',
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
              {`Taken in ${photo?.location || 'Lieu non spécifié'} on ${photo?.date ? dayjs(photo.date, 'D MMMM YYYY').format('MMMM DD, YYYY') : 'Date non spécifiée'} by ${photo?.authorName || 'Auteur inconnu'} with ${photo?.cameraType || 'Non spécifié'}`}
            </p>
          </div>

          {currentUserId === photo?.userId && (
            <div style={{ marginTop: '20px' }}>
              {isEditing ? (
                <div>
                  <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Nouveau titre" style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }} />
                  <input type="text" value={newCameraType} onChange={(e) => setNewCameraType(e.target.value)} placeholder="Type d'appareil photo" style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }} />
                  <input type="text" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} placeholder="Lieu" style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }} />
                  <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }} />
                  <button onClick={handleUpdate} style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 20px', marginRight: '10px', cursor: 'pointer', borderRadius: '5px' }}>Enregistrer</button>
                  <button onClick={() => setIsEditing(false)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '5px' }}>Annuler</button>
                </div>
              ) : (
                <div>
                  <button onClick={() => setIsEditing(true)} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', marginRight: '10px', cursor: 'pointer', borderRadius: '5px' }}>Modifier</button>
                  <button onClick={handleDelete} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '5px' }}>Supprimer</button>
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
