import { useEffect, useState } from 'react';
import { storage } from '../services/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { db } from '../services/firebase'; // Importa Firestore
import { collection, getDocs, query, where } from 'firebase/firestore'; // Importa las funciones necesarias
import { Tabs, TabsList, TabsTrigger } from './ui/Tabs';
import { Button } from './ui/Button';
import Modal from 'react-modal';

const GridMenu = () => {
  const [images, setImages] = useState([]);
  const [activeTab, setActiveTab] = useState('bocadillos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [products, setProducts] = useState([]); // Para almacenar los productos de Firestore

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

  // Nueva función para obtener productos desde Firestore
  const fetchProducts = async (category) => {
    try {
      const productsCollection = collection(db, 'products'); // Usa la colección 'products'
      const q = query(productsCollection, where('category', '==', category)); // Filtra por categoría
      const productSnapshot = await getDocs(q);
      const productsData = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsData);
    } catch (error) {
      console.error(`Error al obtener los productos de la categoría ${category}:`, error);
    }
  };

  useEffect(() => {
    fetchImages(activeTab);
    fetchProducts(activeTab); // Carga los productos cada vez que cambia la pestaña
  }, [activeTab]);

  const openModal = (image) => {
    const menuContent = (
      <div>
        <h2 className="text-2xl font-bold mb-4">{`Menú de ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}</h2>
        <ul>
          {products.map(product => (
            <li key={product.id}>
              {product.name} - ${product.price}
              <p>{product.description}</p>
            </li>
          ))}
        </ul>
      </div>
    );
    setModalContent(menuContent);
    setIsModalOpen(true);
  };

  const getImageClasses = (index) => {
    if (index % 5 === 0) {
      return 'col-span-2 row-span-1';
    } else if (index % 3 === 0) {
      return 'col-span-1 row-span-2';
    } else {
      return 'col-span-1 row-span-1';
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
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: '500px',
            height: 'auto',
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: '#fff',
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
