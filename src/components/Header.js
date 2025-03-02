// Header.js
import React from 'react';
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
}) => {
  const navigate = useNavigate();

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
        />
      </div>
    </header>
  );
};

export default Header;
