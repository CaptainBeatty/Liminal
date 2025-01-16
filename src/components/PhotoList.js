import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from './Loader'; // Assurez-vous que le Loader est importé
import './PhotoList.css';


const PhotoList = ({ photos }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulez un délai de chargement pour tester l'effet de fondu
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Temps de chargement simulé (1 seconde)

    return () => clearTimeout(timer); // Nettoie le timer pour éviter les fuites de mémoire
  }, []);

  return (
    <div className="photo-list">
      {/* Affichage du Loader avec l'effet de fondu */}
      <Loader isVisible={isLoading} />

      <div style={{ ...styles.gridContainer, display: isLoading ? 'none' : 'grid' }}>
        {photos.map((photo) => (
          <div 
            key={photo._id} 
            style={styles.card}
            className="image-container"
          >
            {/* Lien vers les détails de la photo */}
            <Link to={`/photo/${photo._id}`} style={styles.link}>
              <img
                src={photo.imageUrl}
                alt={photo.title}
                style={styles.image}
              />
              <h3 style={styles.title}>{photo.title}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  gridContainer: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    padding: '20px',
  },
  card: {
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    textAlign: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  title: {
    padding: '10px',
    margin: 0,
    fontSize: '16px',
    color: '#333',
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
};

export default PhotoList;
