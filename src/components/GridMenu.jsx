import { useEffect, useState } from 'react';
import { storage } from '../services/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Tabs, TabsList, TabsTrigger } from './ui/Tabs';
import { Button } from './ui/Button';
import Modal from 'react-modal';

const GridMenu = () => {
  const [images, setImages] = useState([]);
  const [activeTab, setActiveTab] = useState('bocadillos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const pdfRef = ref(storage, 'pdfs/menu.pdf');
        const url = await getDownloadURL(pdfRef);
        setPdfUrl(url);
      } catch (error) {
        console.error('Error al obtener la URL del PDF:', error);
      }
    };

    fetchPdfUrl();
  }, []);

  const fetchImages = async (folder) => {
    setIsLoading(true);
    const cachedImages = sessionStorage.getItem(folder);
    
    if (cachedImages) {
      setImages(JSON.parse(cachedImages));
      setIsLoading(false);
      return;
    }
    
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

      sessionStorage.setItem(folder, JSON.stringify(imagesData));
      setImages(imagesData);
    } catch (error) {
      console.error(`Error al obtener las imágenes de la carpeta ${folder}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, 'products');
      const productSnapshot = await getDocs(productsCollection);
      const productsData = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsData);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  useEffect(() => {
    fetchImages(activeTab);
    fetchProducts();
  }, [activeTab]);

  const openModal = () => {
    const filteredProducts = products.filter(product => product.category === activeTab);
    const menuContent = (
      <div>
        <h2 className="text-2xl font-bold mb-4">{`Menú de ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}</h2>
        <ul>
          {filteredProducts.map(product => (
            <li key={product.id} className="mb-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <span className="text-lg font-medium">€{product.price}</span>
              </div>
              <p className="text-sm text-gray-600">{product.description}</p>
              <hr className="mt-4 border-gray-300" />
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
    <section className="container mx-auto px-4 py-12 lg:py-16" id='menu'>
      <h2 className="text-3xl font-bold tracking-tighter text-center mb-4">Conoce nuestro menú</h2>
      <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mb-2 text-center">
          Clickea en las imagenes para conocer mas en detalle nuestro menú.
        </p>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="bocadillos">Bocadillos</TabsTrigger>
          <TabsTrigger value="sandwiches">
            <span className="block md:hidden">Sandwiches</span>
            <span className="hidden md:block">Sandwiches y Tostadas</span>
          </TabsTrigger>
          <TabsTrigger value="especiales">Especiales</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-2 sm:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className={`w-full h-80 m-2 bg-gray-300 animate-pulse rounded-lg ${index === 6 ? 'hidden sm:block' : ''}`}
            ></div>
          ))
        ) : (
          images.map((image, index) => (
            <figure
              key={image.id}
              className={`relative m-2 cursor-pointer ${getImageClasses(index)} ${index === 6 ? 'hidden sm:block' : ''}`}
              onClick={openModal}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="w-full h-60 object-cover object-center rounded-lg shadow-lg hover:scale-105 hover:opacity-90 transition-transform duration-300 ease-in-out"
              />
            </figure>
          ))
        )}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          V - Vegetariano | GF - Sin gluten
        </p>
        <Button 
          variant="outline" 
          onClick={() => window.open(pdfUrl, '_blank')} 
          disabled={!pdfUrl}
          className='hover:scale-105 hover:opacity-90 transition-transform duration-200 ease-in-out'
        >
          Descargar menú completo (PDF)
        </Button>
      </div>

      <Modal
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      ariaHideApp={false}
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
          maxHeight: '80vh', // Limita la altura del modal
          overflowY: 'auto', // Permite el desplazamiento vertical
          padding: '20px',
          borderRadius: '8px',
          backgroundColor: 'white',
        },
      }}
    >
      <Button variant="outline" onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2">✖️</Button>
      {modalContent}
    </Modal>

    </section>
  );
};

export default GridMenu;
