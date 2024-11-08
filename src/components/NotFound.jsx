// src/pages/NotFound.jsx
import Navbar404 from '../components/Navbar404';
import Footer from '../components/Footer';
import { Button } from './ui/Button';
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/"); // Navega a la página de inicio
  };

  return (
    <>
    <Navbar404/>
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-300">
      <h1 className="text-4xl font-bold text-black">404</h1>
      <p className="text-lg text-gray-700 mt-2">La página que buscas no existe.</p>
      <Button variant="outline"  onClick={goToHome} className='my-2'>Volver al sitio</Button>
    </div>
    <Footer/>
    </>
  );
};

export default NotFound;
