import backgroundImage from '../assets/background2.jpg';

const Header = () => {
  return (
    <section
      className="relative w-full bg-center bg-cover flex flex-col justify-center items-center h-[800px] mt-[64px]"
      style={{ backgroundImage: `url(${backgroundImage})` }} // Imagen de fondo
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <header className="relative text-white z-9"> {/* Mantener el texto por encima */}
        <h1 className="text-10xl font-DancingScript">Bienvenido</h1>
        <p className="text-lg mt-4 font-roboto">Tasca la Fundicion</p>
      </header>
    </section>
  );
};


export default Header;
