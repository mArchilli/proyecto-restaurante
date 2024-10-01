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
      const imageRefs = Array.from({ length: 7 }, (_, i) =>
        ref(storage, `images/${folder}/${folder}${i + 1}.jpg`)
      );
      const imageUrls = await Promise.all(
        imageRefs.map((imageRef) => getDownloadURL(imageRef).catch(() => null))
      );

      const imagesData = imageUrls
        .map((url, index) => (url ? { id: index + 1, src: url, alt: `${folder} ${index + 1}` } : null))
        .filter(Boolean);

      setImages(imagesData);
    } catch (error) {
      console.error(`Error al obtener las imágenes de la carpeta ${folder}:`, error);
    }
  };

  useEffect(() => {
    fetchImages(activeTab);
  }, [activeTab]);

  // Función para determinar las clases de la grilla según la pestaña activa
  const getGridClasses = () => {
    switch (activeTab) {
      case 'bocadillos':
        return 'grid grid-cols-2 sm:grid-cols-3 gap-4'; // Grilla estándar para bocadillos
      case 'sandwiches':
        return 'grid grid-cols-2 md:grid-cols-3 gap-4'; // Grilla para sandwiches más amplia
      case 'especiales':
        return 'grid grid-cols-2 md:grid-cols-3 gap-4'; // Grilla más apretada para especiales
      default:
        return 'grid grid-cols-2 sm:grid-cols-3 gap-4'; // Fallback
    }
  };

  // Función para mezclar el orden de las imágenes
  const shuffleImages = (images) => {
    const shuffled = [...images];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Función para obtener las clases de cada imagen
  const getImageClasses = (index) => {
    if (index % 5 === 0) {
      return 'col-span-2 row-span-1'; // Algunas imágenes ocupan 2 columnas y 1 fila
    } else if (index % 3 === 0) {
      return 'col-span-1 row-span-2'; // Otras ocupan 1 columna y 2 filas
    } else {
      return 'col-span-1 row-span-1'; // El resto mantiene el tamaño regular
    }
  };

  const shuffledImages = shuffleImages(images); // Mezcla las imágenes para mayor dinamismo

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold tracking-tighter text-center mb-4">Conoce nuestro menú</h2>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="bocadillos">Bocadillos</TabsTrigger>
          <TabsTrigger value="sandwiches">Sandwiches y Tostadas</TabsTrigger>
          <TabsTrigger value="especiales">Especiales</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className={getGridClasses()}>
        {shuffledImages.map((image, index) => (
          <div key={image.id} className={`relative cursor-pointer ${getImageClasses(index)}`}>
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
