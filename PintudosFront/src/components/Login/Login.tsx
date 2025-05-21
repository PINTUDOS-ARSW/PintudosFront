import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext'; // Asegúrate de que la ruta sea correcta

// Define el tipo del token decodificado (puedes ampliarlo según lo que necesites)
interface DecodedToken {
  name: string;
  email: string;
  picture: string;
  sub: string;
  [key: string]: unknown;
}

const Home: React.FC = () => {
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
    <div>
      <h1>Pintu2</h1>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={() => console.log('Falló el login')}
      />
    </div>
  );
};

export default Home;
