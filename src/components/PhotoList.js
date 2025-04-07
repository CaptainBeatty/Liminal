import React from 'react';
import { Link } from 'react-router-dom';
import Loader from './Loader'; // Assurez-vous que le Loader est importé
import './PhotoList.css';

function getCloudinaryUrl(baseUrl, options = {}) {
  const transformations = [];
  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.format) transformations.push(`f_${options.format}`);

  const transformationString = transformations.join(',');

  return baseUrl.replace('/upload/', `/upload/${transformationString}/`);
}

const PhotoList = ({ photos, isLoading }) => {
  
  return (
    <div className="photo-list">
      {/* Affichage du Loader avec l'effet de fondu */}
      <Loader isVisible={isLoading} />

      <div className= "grid" style={{ ...styles.gridContainer, display: isLoading ? 'none' : 'grid' }}>
        {photos.map((photo) => (
          <div 
            key={photo._id} 
            style={styles.card}
            className="image-container"
          >
            {/* Lien vers les détails de la photo */}
            <Link to={`/photo/${photo._id}`} style={styles.link}>
              <img
                 src={getCloudinaryUrl(photo.imageUrl, {
                  width: 300,       // On peut mettre la plus grande
                  quality: 'auto',  // Ou 'auto:low'/'auto:eco'
                  format: 'auto'
                })}
                alt={photo.title}
              
                // Définition du srcset
                srcSet={`
                  ${getCloudinaryUrl(photo.imageUrl, { width: 250, quality: 'auto', format: 'auto' })} 250w,
                  ${getCloudinaryUrl(photo.imageUrl, { width: 300, quality: 'auto', format: 'auto' })} 300w
                `}
              
                // sizes : on indique la taille à utiliser suivant la largeur de l’écran
                sizes="(max-width: 600px) 250px, 300px"
                
                loading="lazy"
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
    backgroundColor: 'lightgray',
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
    fontStyle: 'italic',
    color: '#333',
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
};

export default PhotoList;
