import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import dayjs from 'dayjs';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const PhotoForm = ({ onPhotoAdded, onClose }) => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [cameraType, setCameraType] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      if (!title || !date || !image || !location) {
        setErrorMessage('Please fill in all required fields (title, image, date, location).');
        return;
      }

      if (!image.type.startsWith('image/')) {
        setErrorMessage('Please select a valid image file.');
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('image', image);
      formData.append('cameraType', cameraType);
      formData.append('location', location);
      formData.append('date', dayjs(date).format('YYYY-MM-DD'));

      const res = await axiosInstance.post('/photos', formData);

      if (res.status === 201) {
        setTitle('');
        setImage(null);
        setCameraType('');
        setLocation('');
        setDate('');

        if (onPhotoAdded) {
          onPhotoAdded(res.data);
        }

        // Fermer le formulaire et rediriger vers la page d'accueil
        onClose();
        navigate('/');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Erreur lors de l\'ajout de la photo.');
    }
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      contentLabel="Add a liminal"
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
        },
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add a liminal</h2>
      {errorMessage && <p style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            id="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={styles.input}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            id="cameraType"
            placeholder="Camera/System"
            value={cameraType}
            onChange={(e) => setCameraType(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            id="location"
            placeholder="Place"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <button
            type="submit"
            style={{
              ...styles.button,
              backgroundColor: '#28a745',
              marginRight: '10px',
            }}
          >
            Add
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              ...styles.button,
              backgroundColor: '#dc3545',
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

const styles = {
  input: {
    width: '100%',
    padding: '8px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    color: 'white',
    cursor: 'pointer',
  },
};

export default PhotoForm;
