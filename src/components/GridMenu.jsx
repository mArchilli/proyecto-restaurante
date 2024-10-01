import { useEffect, useState } from 'react';
import { storage } from '../services/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { Tabs, TabsList, TabsTrigger } from './ui/Tabs';

const GridMenu = () => {
  const [images, setImages] = useState([]);
  const [activeTab, setActiveTab] = useState('bocadillos'); // Tab por defecto

  // Función para obtener imágenes según la categoría
  const fetchImages = async (folder) => {
    try {
      const imageRefs = Array.from({ length: 6 }, (_, i) =>
        ref(storage, `images/${folder}/${folder}${i + 1}.jpg`) // Usa el nombre de la carpeta
      );
      const imageUrls = await Promise.all(
        imageRefs.map((imageRef) => getDownloadURL(imageRef))
      );

      const imagesData = imageUrls.map((url, index) => ({
        id: index + 1,
        src: url,
        alt: `${folder} ${index + 1}`,
      }));

      setImages(imagesData); // Actualiza las imágenes según la categoría
    } catch (error) {
      console.error(`Error al obtener las imágenes de la carpeta ${folder}:`, error);
    }
  };

  useEffect(() => {
    fetchImages(activeTab); // Llama a la función cada vez que cambia la categoría
  }, [activeTab]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Título */}
      <h2 className="text-3xl font-bold tracking-tighter text-center mb-4">Conoce nuestro menú</h2>

      {/* Tabs para seleccionar la categoría */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="bocadillos">Bocadillos</TabsTrigger>
          <TabsTrigger value="sandwiches">Sandwiches y Tostadas</TabsTrigger>
          <TabsTrigger value="especiales">Especiales</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Grilla de imágenes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`relative cursor-pointer ${
              index % 5 === 0
                ? 'col-span-2 row-span-1' // Algunas imágenes ocupan 2 columnas y 1 fila
                : index % 3 === 0
                ? 'col-span-1 row-span-2' // Otras ocupan 1 columna y 2 filas
                : 'col-span-1 row-span-1' // El resto mantiene el tamaño regular
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-48 object-cover rounded-lg shadow-lg hover:opacity-80 transition-opacity duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridMenu;
