import { useEffect, useState } from "react";
import { storage } from "../services/firebase";
import { ref, getDownloadURL } from "firebase/storage";

const Header = () => {
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");

  // Cargar la imagen desde Firebase Storage
  useEffect(() => {
    const fetchImage = async () => {
      try {
        // Referencia a la imagen en la carpeta 'header' en Firebase Storage
        const imageRef = ref(storage, "images/header/header-imagen.jpg");
        const url = await getDownloadURL(imageRef); // Obtén la URL de descarga
        setBackgroundImageUrl(url); // Guarda la URL en el estado
      } catch (error) {
        console.error("Error al obtener la imagen:", error);
      }
    };

    fetchImage(); // Llama a la función cuando el componente se monta
  }, []);

  return (
    <header
      id="header"
      className="relative w-full bg-bottom bg-cover flex flex-col justify-center items-center h-[1000px] py-40"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center", 
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative text-white z-9">
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-DancingScript">
          Tasca La Fundición
        </h1>
        {/* <p className="text-1xl md:text-3xl lg:text-5xl mt-4 font-roboto">Tasca la Fundición</p> */}
      </div>
    </header>
  );
};

export default Header;
