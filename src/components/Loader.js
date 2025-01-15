import React from 'react';
import './Loader.css'; // Fichier CSS à créer

const Loader = ({ isVisible }) => {
  return (
    <div className={`loader-overlay ${isVisible ? 'visible' : 'hidden'}`}></div>
  );
};

export default Loader;
