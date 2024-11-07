// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFound = () => {
  return (
    <>
    <Navbar/>
    <div className="flex flex-col items-center justify-center h-screen text-center bg-black">
      <h1 className="text-4xl font-bold text-white">404</h1>
      <p className="text-lg text-gray-700 mt-2">La página que buscas no existe.</p>
      <Link to="/" className="mt-4 text-blue-500 hover:underline">
        Volver a la página principal
      </Link>
    </div>
    <Footer/>
    </>
  );
};

export default NotFound;
