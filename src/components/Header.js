// Header.js
import React, { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import BurgerMenu from './BurgerMenu.js';
import './Header.css';
import SettingsForm from "./SettingsForm";
import axiosInstance from '../services/axiosInstance';

const Header = ({
  username,
  onLogout,
  onTogglePhotoForm,
  isPhotoFormOpen,
  onShowLogin,
  onShowRegister,
  isLoginOpen,
  isRegisterOpen,
}) => {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get('/auth/me'); // Bearer token envoyé via intercepteur
        const { email } = response.data;
        setUserEmail(email);
        // vous pouvez aussi setUsername(username) ici, etc.
      } catch (error) {
        console.error('Impossible de récupérer le user', error);
      }
    };
  
    fetchUserInfo();
  }, []);
  
  // Fonction pour ouvrir la modale Settings
  const handleShowSettings = () => {
    setSettingsOpen(true);
  };

  // Fonction pour fermer la modale Settings
  const handleCloseSettings = () => {
    setSettingsOpen(false);
  };

  return (
    <header className="header">
      <h1 className="title" onClick={() => navigate('/')}>
        лиминал
      </h1>
      <div className="rightSection">
      {username && (
          <span className="welcomeMessage">Hello {username}</span>
        )}
        <BurgerMenu
          username={username}
          onLogout={onLogout}
          onTogglePhotoForm={onTogglePhotoForm}
          isPhotoFormOpen={isPhotoFormOpen}
          onShowLogin={onShowLogin}
          onShowRegister={onShowRegister}
          isLoginOpen={isLoginOpen}
          isRegisterOpen={isRegisterOpen}
          onShowSettings={handleShowSettings} // Passage de la fonction d'ouverture
        />
      </div>
      {/* Affichage de la modale Settings */}
      {settingsOpen && (
        <div 
        onClick={handleCloseSettings} // Un clic sur l'overlay ferme la modale  
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <SettingsForm 
            onClose={handleCloseSettings}
            currentEmail={userEmail}
            onDeleteAccount={onLogout}   
          />
        </div>
      )}
    </header>
  );
};

export default Header;
