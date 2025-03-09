// BurgerMenu.js
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBars } from '@fortawesome/free-solid-svg-icons'; 
import './BurgerMenu.css'; // Vous pouvez créer ou adapter ce fichier CSS

const BurgerMenu = ({
  username,
  onLogout,
  onTogglePhotoForm,
  isPhotoFormOpen,
  onShowLogin,
  onShowRegister,
  onShowSettings, // Nouvelle prop pour ouvrir le formulaire Settings
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const burgerRef = useRef(null);

  const handleMenuToggle = () => {
    setMenuOpen(prev => !prev);
  };

  // Ferme le menu lorsqu'on clique en dehors de l'icône et du menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        burgerRef.current &&
        !burgerRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="burger-menu-container">
      <div className="menuIcon" onClick={handleMenuToggle} ref={burgerRef}>
        <FontAwesomeIcon icon={faBars} />
      </div>

      {menuOpen && (
        <div className="dropdownMenu" ref={menuRef}>
          {username ? (
            <>
              <div
                className="dropdownItem"
                onClick={() => {
                  onTogglePhotoForm();
                  setMenuOpen(false);
                }}
              >
                {isPhotoFormOpen ? 'Close Post Form' : (
                  <>
                    <FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />
                    Post
                  </>
                )}
              </div>
              <div
                className="dropdownItem"
                onClick={() => {
                  // Ouvre la modale de paramètres
                  onShowSettings();
                  setMenuOpen(false);
                }}
              >
                Settings
              </div>
              <div
                className="dropdownItem"
                onClick={() => {
                  onLogout();
                  setMenuOpen(false);
                }}
              >
                Logout
              </div>
            </>
          ) : (
            <>
              <div
                className="dropdownItem"
                onClick={() => {
                  onShowLogin();
                  setMenuOpen(false);
                }}
              >
                Login
              </div>
              <div
                className="dropdownItem"
                onClick={() => {
                  onShowRegister();
                  setMenuOpen(false);
                }}
              >
                Register
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BurgerMenu;
