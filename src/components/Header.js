// Header.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BurgerMenu from './BurgerMenu.js';
import './Header.css';


const Header = ({
  username,
  onLogout,
  onTogglePhotoForm,
  isPhotoFormOpen,
  onShowLogin,
  onShowRegister,
  isLoginOpen,
  isRegisterOpen,
  onShowSettings, // Prop passée depuis App.js
}) => {
  const navigate = useNavigate();
  const [showHeader, setShowHeader] = useState(true);

  // Gestion du scroll pour masquer/afficher le header
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const isAtBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 5;
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setShowHeader(false);
      } else if (window.scrollY < lastScrollY) {
        if (window.scrollY < 50 || isAtBottom) {
          setShowHeader(true);
        }
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Réaffichage du header lors du mouvement de la souris en haut de l'écran
  useEffect(() => {
    const handleMouseMove = (event) => {
      if (event.clientY < 50) {
        setShowHeader(true);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
          onShowSettings={onShowSettings}  // Transmission de la fonction de gestion des modales
        />
      </div>
    </header>
  );
};

export default Header;
