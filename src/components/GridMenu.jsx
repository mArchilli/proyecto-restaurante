import { useEffect, useState } from 'react';
import { storage } from '../services/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { Tabs, TabsList, TabsTrigger } from './ui/Tabs';
import { Button } from './ui/Button';
import Modal from 'react-modal';

const GridMenu = () => {
  const [images, setImages] = useState([]);
  const [activeTab, setActiveTab] = useState('bocadillos'); // Tab por defecto
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la visibilidad de la modal
  const [modalContent, setModalContent] = useState(null); // Contenido del menú en la modal

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

  // Función para abrir la modal con el contenido correspondiente
  const openModal = (image) => {
    const menuContent = getMenuContent(image.alt.split(' ')[0]); // Obtiene el menú según el tipo
    setModalContent(menuContent);
    setIsModalOpen(true);
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

  // Contenido de los menús según la categoría
  const getMenuContent = (category) => {
    switch (category) {
      case 'bocadillos':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Menú de Bocadillos</h2>
            <ul>
              <li>Bocadillo 1 - $5.99</li>
              <li>Bocadillo 2 - $6.99</li>
              <li>Bocadillo 3 - $7.99</li>
            </ul>
          </div>
        );
      case 'sandwiches':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Menú de Sandwiches</h2>
            <ul>
              <li>Sandwich 1 - $8.99</li>
              <li>Sandwich 2 - $9.99</li>
              <li>Sandwich 3 - $10.99</li>
            </ul>
          </div>
        );
      case 'especiales':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Menú de Especiales</h2>
            <ul>
              <li>Especial 1 - $12.99</li>
              <li>Especial 2 - $13.99</li>
              <li>Especial 3 - $14.99</li>
            </ul>
          </div>
        );
      default:
        return <div>No hay menú disponible.</div>;
    }
  };

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

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`relative cursor-pointer ${getImageClasses(index)}`}
            onClick={() => openModal(image)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-48 object-cover rounded-lg shadow-lg hover:opacity-80 transition-opacity duration-300"
            />
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            V - Vegetarian | GF - Gluten-Free
          </p>
          <Button variant="outline">Download Full Menu (PDF)</Button>
        </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Menú"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro translúcido
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)', // Centra la modal
            width: '80%', // Anchura ajustable
            maxWidth: '500px', // Máximo ancho
            height: 'auto',
            padding: '20px', // Espacio alrededor del contenido
            borderRadius: '8px', // Bordes redondeados
            backgroundColor: '#fff', // Fondo blanco
          },
        }}
      >
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-2"
        >
          X
        </button>
        <div>{modalContent}</div>
      </Modal>
    </div>
  );
};

export default GridMenu;
