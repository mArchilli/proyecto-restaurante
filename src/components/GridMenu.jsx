import { useEffect, useState } from 'react';
import { storage } from '../services/firebase'; // Asegúrate de que esta ruta sea correcta
import { ref, getDownloadURL } from 'firebase/storage';

const GridMenu = () => {
  const [images, setImages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imageRefs = [
          ref(storage, 'images/menu/menu-imagen1.jpg'),
          ref(storage, 'images/menu/menu-imagen2.jpg'),
          ref(storage, 'images/menu/menu-imagen3.jpg'),
          ref(storage, 'images/menu/menu-imagen4.jpg'),
          ref(storage, 'images/menu/menu-imagen5.jpg'),
          ref(storage, 'images/menu/menu-imagen6.jpg'),
          ref(storage, 'images/menu/menu-imagen7.jpg'),
        ];

        const imageUrls = await Promise.all(
          imageRefs.map((imageRef) => getDownloadURL(imageRef))
        );

        const imagesData = imageUrls.map((url, index) => ({
          id: index + 1,
          src: url,
          alt: `Imagen ${index + 1}`,
        }));

        setImages(imagesData); // Guarda las imágenes en el estado
      } catch (error) {
        console.error('Error al obtener las imágenes:', error);
      }
    };

    fetchImages();
  }, []);

  const openModal = (image) => {
    setCurrentImage(image);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentImage(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Agregar título */}
      <h2 className="text-3xl font-bold text-center mb-6">Menu</h2>

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

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
            <button className="text-red-500 mb-4" onClick={closeModal}>
              Cerrar
            </button>
            {currentImage && (
              <div>
                <img
                  src={currentImage.src}
                  alt={currentImage.alt}
                  className="w-full h-auto rounded-lg"
                />
                <p className="mt-2 text-center">{currentImage.alt}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GridMenu;
