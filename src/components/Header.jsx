// import backgroundImage from '../assets/background2.jpg';

const Header = () => {
  return (
    // <section
    //   className="relative w-full bg-center bg-cover flex flex-col justify-center items-center h-[800px] mt-[64px]"
    //   style={{ backgroundImage: `url(${backgroundImage})` }} // Imagen de fondo
    // >
    //   <div className="absolute inset-0 bg-black opacity-50"></div>
    //   <header className="relative text-white z-9"> {/* Mantener el texto por encima */}
    //     <h1 className="text-10xl font-DancingScript">Bienvenido</h1>
    //     <p className="text-lg mt-4 font-roboto">Tasca la Fundicion</p>
    //   </header>
    // </section>

    <section className="w-full py-28 md:py-20 lg:py-25 xl:py-30">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none font-DancingScript">
              Tasca la Fundicion
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Experimente la excelencia culinaria en el corazón de la ciudad. Nuestro menú elaborado por un chef presenta ingredientes de origen local y sabores innovadores.
            </p>
          </div>
          <div className="space-x-4">
            <button className="bg-white text-black border-black hover:bg-black hover:text-white hover:border-black">Reserve a Table</button>
            <button className="bg-white text-black border-black hover:bg-black hover:text-white hover:border-black">View Menu</button>
          </div>
        </div>
      </div>
    </section>
  );
};


export default Header;
