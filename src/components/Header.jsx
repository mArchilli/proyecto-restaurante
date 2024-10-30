import { useEffect, useState } from "react";
import { storage } from "../services/firebase";
import { ref, getDownloadURL } from "firebase/storage";

const Header = () => {
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Estado de carga para el skeleton

  // Cargar la imagen desde Firebase Storage
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const imageRef = ref(storage, "images/header/header-imagen.jpg");
        const url = await getDownloadURL(imageRef);
        setBackgroundImageUrl(url);
        setIsLoading(false); // Oculta el skeleton cuando la imagen está cargada
      } catch (error) {
        console.error("Error al obtener la imagen:", error);
        setIsLoading(false); // Asegura que el skeleton se oculta incluso en caso de error
      }
    };

    fetchImage();
  }, []);

  return (
    <header
      id="header"
      className="relative w-full flex flex-col justify-center items-center h-[1000px] py-40"
      style={{
        backgroundImage: isLoading ? "" : `url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Skeleton para el fondo */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
      )}

      {/* Capa de superposición cuando la imagen está cargada */}
      {!isLoading && (
        <div className="absolute inset-0 bg-black opacity-50"></div>
      )}

      {/* Contenido de texto */}
      <div className="relative text-white z-11">
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-DancingScript">
          Tasca La Fundición
        </h1>
      </div>
    </header>
  );
};

export default Header;
