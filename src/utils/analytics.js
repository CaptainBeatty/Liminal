// src/utils/analytics.js
import ReactGA from "react-ga4";

// Fonction pour initialiser Google Analytics
export const initGA = (trackingId) => {
  ReactGA.initialize(trackingId);
};

// Fonction pour envoyer un suivi de page
export const trackPage = (page) => {
  ReactGA.send({ hitType: "pageview", page });
};
