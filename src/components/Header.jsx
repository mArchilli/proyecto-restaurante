
import backgroundImage from '../assets/background2.jpg'; // Asegúrate de que la ruta sea correcta

const Header = () => {
  return (
    <section
      className="relative w-full bg-center flex flex-col justify-center items-center"
      style={{ backgroundImage: `url(${backgroundImage})`, height: '100vh' }} // Asegura proporción de altura
    >
      <header className="relative text-white z-10"> {/* Mantener el texto por encima */}
        <h1 className="text-10xl font-DancingScript">Bienvenido a mi sitio web</h1>
        <p className="text-lg mt-4">¡Explora nuestras soluciones!</p>
      </header>
    </section>
  );
};

export default Header;
