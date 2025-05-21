import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './components/AuthContext/AuthContext';
import Login from './components/Login/Login'; 
import Juego from './components/Juego/Juego'; 
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Home from './components/Home/Home'; // Asegúrate de que la ruta sea correcta

function App() {
  return (
    <GoogleOAuthProvider clientId="186447712086-73urgfm1lll5069lh18ed9venvnsr5an.apps.googleusercontent.com">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/juego" element={
              <ProtectedRoute>
                <Juego />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
