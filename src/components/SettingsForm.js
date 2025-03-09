// SettingsForm.js
import React, { useState } from 'react';
import axiosInstance from '../services/axiosInstance';
import { useNavigate } from 'react-router-dom';

const SettingsForm = ({ onClose, currentEmail, onDeleteAccount }) => {
  const [email, setEmail] = useState(currentEmail || '');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Hook de react-router-dom

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await axiosInstance.put('/auth/update-email', { email });
      setSuccess('Email modifié avec succès');
    } catch (err) {
      console.error(err);
        if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); 
      } else {
        setError('Erreur lors de la mise à jour de l’email');
        }
      } finally {
            setLoading(false);
      }
    };

     const handleDeleteAccount = async () => {
         // Demander confirmation
         const confirmed = window.confirm(
           'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.'
         );
         if (!confirmed) return;
      
         setLoading(true);
         setSuccess('');
         setError('');
      
         try {
           // Appel DELETE
           await axiosInstance.delete('/auth/delete-account');
           
           localStorage.removeItem('token');
           localStorage.removeItem('username');
           localStorage.removeItem('email');

           setSuccess('Compte supprimé avec succès');
           navigate('/');

           if (onDeleteAccount) {
                onDeleteAccount(); // ex: appelle handleLogout() dans le parent
           }

           onClose();
            
         } catch (err) {
           console.error(err);
           setError('Erreur lors de la suppression du compte');
         } finally {
           setLoading(false);
         }
       };

  const handleOverlayClick = () => {
    if (onClose) onClose();
  };


  return (
    <div style={modalStyles.overlay} onClick={handleOverlayClick}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
      <button onClick={onClose} style={modalStyles.closeButton}>&times;</button>
      <div style={styles.container}>
      <h2 style={styles.title}>Change email</h2>
      {/* Afficher l'email actuel si disponible */}
         {currentEmail && (
           <p style={{ marginBottom: '10px' }}>
             <strong>Current email : </strong>{currentEmail}
           </p>
         )}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input 
            type="email" 
            value={email}
            placeholder='New email'
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Loading...' : "Save"}
            </button>
      </form>

               <hr style={{ margin: '20px 0' }} />
               <h2 style={styles.title}>Delete account</h2>
         <button
           onClick={handleDeleteAccount}
           style={{ ...styles.button, backgroundColor: 'red' }}
           disabled={loading}
         >
           {loading ? 'Loading...' : 'Delete'}
         </button>
      {success && <p style={{color: 'green'}}>{success}</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
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
    padding: '20px 30px',
    borderRadius: '10px',
    position: 'relative',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '15px',
    background: 'none',
    border: 'none',
    fontSize: '25px',
    cursor: 'pointer',
  },
};

const styles = {
  container: {
    textAlign: 'center',
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginBottom: '15px',
  },
};


export default SettingsForm;
