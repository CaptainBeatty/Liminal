// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PhotoForm from "./components/PhotoForm";
import PhotoList from "./components/PhotoList";
import PhotoDetails from "./components/PhotoDetails";
import Register from "./components/Register";
import Login from "./components/Login";
import Header from "./components/Header";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import PrivateRoute from "./services/PrivateRoute";
import axiosInstance from "./services/axiosInstance";
import Footer from "./components/Footer"; 
import AboutAndLiminal from "./pages/AboutAndLiminal";
import { jwtDecode } from "jwt-decode";
import { initGA } from "./utils/analytics";
import usePageTracking from "./hooks/usePageTracking";
import SettingsForm from "./components/SettingsForm";
import "./App.css"

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(''); // Nouvel état pour l'email
  const [activeModal, setActiveModal] = useState(null); // Contrôle global des modales
  const [showPhotoForm, setShowPhotoForm] = useState(false);

  // Initialisation de Google Tag Manager
  useEffect(() => {
    initGA("G-PNZ4P73F9W");
  }, []);

  // Charger les photos depuis le backend
  const fetchPhotos = async () => {
    try {
      const res = await axiosInstance.get("/photos");
      setPhotos(res.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des photos:", err);
    }
  };

  // Gestion de la connexion réussie
  const handleLoginSuccess = (username) => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUsername(username);
      setCurrentUserId(decodedToken.id);
      localStorage.setItem("username", username);
      setActiveModal(null); // Ferme toutes les modales
    }
    fetchPhotos();
  };

  // Gestion de la déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername("");
    setCurrentUserId(null);
    setShowPhotoForm(false);
    setActiveModal(null); // Ferme toutes les modales
    fetchPhotos();
  };

  // Gestion des modales avec fermeture si déjà ouvertes
  const handleShowLogin = () => {
    setActiveModal((prev) => (prev === "login" ? null : "login"));
  };

  const handleShowRegister = () => {
    setActiveModal((prev) => (prev === "register" ? null : "register"));
  };

  const handleShowForgotPassword = () => {
    setActiveModal("forgotPassword");
  };

  // Gestion de l'ouverture du formulaire Settings
  const handleShowSettings = () => {
    setActiveModal((prev) => (prev === "settings" ? null : "settings"));
  };

  // Toggle formulaire photo
  const handlePhotoFormToggle = () => {
    setShowPhotoForm((prevState) => !prevState);
    setActiveModal(null); // Ferme toutes les autres modales
  };

  // Charger les données utilisateur et photos au montage du composant
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUsername(storedUsername || decodedToken.username);
      // Récupération de l'email utilisateur
      const fetchUserInfo = async () => {
        try {
          const response = await axiosInstance.get('/auth/me');
          setUserEmail(response.data.email);
        } catch (error) {
          console.error("Impossible de récupérer le user", error);
        }
      };
      fetchUserInfo();
    }
    fetchPhotos();
  }, [username]);

  return (
    <Router>
      <PageTracker />
      <div className="app-container">
        <Header
          username={username}
          onLogout={handleLogout}
          onShowLogin={handleShowLogin}
          onShowRegister={handleShowRegister}
          onTogglePhotoForm={handlePhotoFormToggle}
          isPhotoFormOpen={showPhotoForm}
          isLoginOpen={activeModal === "login"}
          isRegisterOpen={activeModal === "register"}
          onShowSettings={handleShowSettings}  // Passage de la fonction pour ouvrir SettingsForm
        />
        <div className="content" style={{ padding: "20px" }}>
          {/* Modales */}
          {activeModal === "login" && (
            <div style={{ position: "relative", zIndex: 100 }}>
              <Login
                onLoginSuccess={handleLoginSuccess}
                onClose={() => setActiveModal(null)}
                onForgotPassword={handleShowForgotPassword}
              />
            </div>
          )}
          {activeModal === "forgotPassword" && (
            <div style={{ position: "relative", zIndex: 100 }}>
              <ForgotPassword onCancel={() => setActiveModal(null)} />
            </div>
          )}
          {activeModal === "register" && (
            <div style={{ position: "relative", zIndex: 100 }}>
              <Register onClose={() => setActiveModal(null)} />
            </div>
          )}
          {activeModal === "settings" && (
            <div style={{ position: "relative", zIndex: 100 }}>
              <SettingsForm 
                onClose={() => setActiveModal(null)}
                currentEmail={userEmail}
                onDeleteAccount={handleLogout}
              />
            </div>
          )}
          
          {/* Routes */}
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  {showPhotoForm && username && (
                    <PhotoForm
                      onPhotoAdded={fetchPhotos}
                      onClose={() => setShowPhotoForm(false)}
                    />
                  )}
                  <PhotoList
                    photos={photos}
                    onPhotoDeleted={fetchPhotos}
                    currentUserId={currentUserId}
                  />
                </div>
              }
            />
            <Route path="/forgot-password" element={<ForgotPassword onCancel={() => setActiveModal(null)} />} />
            <Route
              path="/reset-password/:token"
              element={<ResetPassword onShowLogin={() => setActiveModal("login")} />}
            />
            <Route path="/about-liminal" element={<AboutAndLiminal />} />
            <Route
              path="/photo/:id"
              element={
                <div>
                  <PhotoDetails
                    currentUserId={currentUserId}
                    onPhotoDeleted={fetchPhotos}
                    onShowLogin={() => setActiveModal('login')}
                    isLoginOpen={activeModal === 'login'}
                    onPhotoUpdated={fetchPhotos}
                  />
                  {showPhotoForm && username && (
                    <PhotoForm
                      onPhotoAdded={fetchPhotos}
                      onClose={() => setShowPhotoForm(false)}
                    />
                  )}
                </div>
              }
            />
            <Route
              path="/add-photo"
              element={
                <PrivateRoute>
                  <PhotoForm
                    onPhotoAdded={fetchPhotos}
                    onClose={() => setShowPhotoForm(false)}
                  />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
      <Footer /> 
    </Router>
  );
};

// Composant pour suivre les pages
const PageTracker = () => {
  usePageTracking();
  return null;
};

export default App;
