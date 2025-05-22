import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  FC
} from 'react';

// Define el tipo del contexto
interface AuthContextType {
  token: string | null;
  login: (newToken: string) => void;
  logout: () => void;
}

// Crear contexto con valor inicial `undefined`
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props del proveedor
interface AuthProviderProps {
  children: ReactNode;
}

// Componente proveedor
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
