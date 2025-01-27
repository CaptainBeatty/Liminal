import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import './Header.css'; // Importation du fichier CSS

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
  const navigate = useNavigate(); // Hook pour naviguer entre les pages

  return (
    <header className="header">
      <h1 className="title" onClick={() => navigate('/')}>лиминал</h1>
      <div className="rightSection">
        {username && (
          <span className="welcomeMessage">Hello {username}</span>
        )}
        {username ? (
          <>
            <button
              className={`button ${isPhotoFormOpen ? 'photoFormOpen' : ''}`}
              onClick={onTogglePhotoForm}
            >
              {isPhotoFormOpen ? (
                'Close'
              ) : (
                <>
                  <FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />
                  Post
                </>
              )}
            </button>
            <button className="button" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className={`button ${isLoginOpen ? 'loginOpen' : ''}`}
              onClick={onShowLogin}
            >
              {isLoginOpen ? 'Close' : 'Login'}
            </button>
            <button
              className={`button ${isRegisterOpen ? 'registerOpen' : ''}`}
              onClick={onShowRegister}
            >
              {isRegisterOpen ? 'Close' : 'Register'}
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
