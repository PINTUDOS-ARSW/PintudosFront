import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';
import './Login.css'; // Asegúrate de importar el CSS

interface DecodedToken {
  name: string;
  email: string;
  picture: string;
  sub: string;
  [key: string]: unknown;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSuccess = (credentialResponse: CredentialResponse) => {
    const token = credentialResponse.credential;
    if (token) {
      const user = jwtDecode<DecodedToken>(token);
      console.log("Usuario:", user);
      login(token);
      navigate("/home");
    } else {
      console.error("No se recibió token de Google");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Bienvenido a <span>Pintu2</span></h1>
        <p className="login-subtitle">Inicia sesión para comenzar a jugar</p>
        <div className="login-button">
          <GoogleLogin
            onSuccess={onSuccess}
            onError={() => console.log('Falló el login')}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
