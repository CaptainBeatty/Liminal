import React, { useState, useEffect } from 'react';
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
  const [showHeader, setShowHeader] = useState(true);

  // Récupération des infos utilisateur
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get('/auth/me');
        const { email } = response.data;
        setUserEmail(email);
      } catch (error) {
        console.error('Impossible de récupérer le user', error);
      }
    };
    fetchUserInfo();
  }, []);

  // Gestion du scroll pour masquer/afficher le header
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const isAtBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 5;

      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        // Scroll vers le bas : on cache le header
        setShowHeader(false);
      } else if (window.scrollY < lastScrollY) {
        // Scroll vers le haut : on affiche le header uniquement si
        // la position de scroll est proche du haut ou si l'on est en bas de page
        if (window.scrollY < 50 || isAtBottom) {
          setShowHeader(true);
        }
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Gestion du déplacement de la souris pour réafficher le header
  useEffect(() => {
    const handleMouseMove = (event) => {
      // Si le curseur se trouve à moins de 50px du haut de la fenêtre, on affiche le header
      if (event.clientY < 50) {
        setShowHeader(true);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Gestion de l'ouverture/fermeture de la modale Settings
  const handleShowSettings = () => {
    setSettingsOpen(true);
  };
  const handleCloseSettings = () => {
    setSettingsOpen(false);
  };

  return (
    <header className={`header ${showHeader ? 'header--visible' : 'header--hidden'}`}>
      <h1 className="title" onClick={() => navigate('/')}>
        Liminal
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
          onShowSettings={handleShowSettings}
        />
      </div>
      {settingsOpen && (
        <div 
          onClick={handleCloseSettings}
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
