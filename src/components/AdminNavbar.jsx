import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase'; // Importa Firebase Auth
import { signOut } from 'firebase/auth'; // Importa el método de cierre de sesión

const AdminNavbar = () => {
  const navigate = useNavigate(); // Para redirigir después de cerrar sesión

  const handleLogout = async () => {
    try {
      await signOut(auth); // Cierra sesión con Firebase
      navigate('/login'); // Redirige al usuario a la página de login
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Puedes manejar el error mostrando una alerta o mensaje si lo prefieres
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full text-white py-4 shadow-md z-10 bg-black">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="text-2xl font-bold">Admin Panel</div>
        <ul className="flex space-x-4">
          <li><Link to="/upload-images" className="hover:text-gray-300 text-white">Subir Imagen</Link></li>
          <li><Link to="/" className="hover:text-gray-300 text-white">Volver al Inicio</Link></li>
          <li>
            {/* Usamos Link pero con onClick para cerrar sesión */}
            <Link 
              to="/login" 
              className="hover:text-gray-300 text-white" 
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavbar;
