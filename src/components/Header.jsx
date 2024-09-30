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
        const imageRef = ref(storage, "images/header/headerImage.jpg"); // Ajusta el nombre de la imagen según corresponda
        const url = await getDownloadURL(imageRef); // Obtén la URL de descarga
        setBackgroundImageUrl(url); // Guarda la URL en el estado
      } catch (error) {
        console.error("Error al obtener la imagen:", error);
      }
    };

    fetchImage(); // Llama a la función cuando el componente se monta
  }, []);

  return (
    <section
      className="relative w-full bg-center bg-cover flex flex-col justify-center items-center h-[800px] mt-[64px]"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`, // Aplica la URL como fondo si está disponible
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <header className="relative text-white z-9">
        <h1 className="text-10xl font-DancingScript">Bienvenido</h1>
        <p className="text-lg mt-4 font-roboto">Tasca la Fundicion</p>
      </header>
    </section>
  );
};

export default Header;
