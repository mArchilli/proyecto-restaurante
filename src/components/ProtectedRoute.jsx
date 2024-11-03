import { Navigate } from 'react-router-dom';
import { auth } from '../services/firebase'; 
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Estado para verificar autenticación

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Actualiza el estado según la autenticación
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Muestra un cargador mientras se verifica la autenticación
  if (isAuthenticated === null) {
    return <div>Cargando...</div>;
  }

  // Redirige si no está autenticado
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
