import { useEffect, useState } from 'react';
import { storage } from '../services/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Tabs, TabsList, TabsTrigger } from './ui/Tabs';
import { Button } from './ui/Button';
import Modal from 'react-modal';
import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';

const GridMenu = () => {
  const [images, setImages] = useState([]);
  const [activeTab, setActiveTab] = useState('bocadillos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchImages = async (folder) => {
    try {
      setIsLoading(true);
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
    const menuContent = (
      <div>
        <h2 className="text-2xl font-bold mb-4">{`Menú de ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}</h2>
        <ul>
          {products.map(product => (
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

  const generateMenuPDF = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]); // Tamaño de página
      const { height } = page.getSize();
  
      // Estilos básicos para el PDF
      const titleFontSize = 24;
      const categoryFontSize = 20;
      const productFontSize = 16;
      const margin = 40;
  
      // Añadir título
      page.drawText('Menú del Restaurante', {
        x: margin,
        y: height - margin - titleFontSize,
        size: titleFontSize,
        color: rgb(0, 0.53, 0.71),
      });
  
      // Agrupar productos por categoría
      const groupedProducts = products.reduce((acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
      }, {});
  
      // Añadir productos con precios
      let yPosition = height - margin - titleFontSize * 2;
      for (const category in groupedProducts) {
        // Añadir subtítulo para la categoría
        page.drawText(category.charAt(0).toUpperCase() + category.slice(1), {
          x: margin,
          y: yPosition,
          size: categoryFontSize,
          color: rgb(0, 0.53, 0.71),
        });
  
        yPosition -= categoryFontSize + 10;
  
        groupedProducts[category].forEach((product) => {
          const productText = `${product.name} - €${product.price}`;
          const descriptionText = product.description;
  
          // Nombre y precio del producto
          page.drawText(productText, {
            x: margin,
            y: yPosition,
            size: productFontSize,
            color: rgb(0, 0, 0),
          });
  
          yPosition -= productFontSize + 5;
  
          // Descripción del producto (si tiene)
          if (descriptionText) {
            page.drawText(descriptionText, {
              x: margin + 10,
              y: yPosition,
              size: productFontSize - 2,
              color: rgb(0.5, 0.5, 0.5),
            });
            yPosition -= productFontSize + 5;
          }
  
          yPosition -= 10; // Espacio entre productos
        });
  
        yPosition -= 20; // Espacio entre categorías
      }
  
      // Guardar el PDF y descargarlo
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, 'menu_restaurante.pdf');
    } catch (error) {
      console.error('Error generando el PDF:', error);
    }
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
          // Skeletons para carga de imágenes
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
                className="w-full h-60 object-cover object-center rounded-lg shadow-lg hover:opacity-80 transition-opacity duration-300"
              />
            </figure>
          ))
        )}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          V - Vegetariano | GF - Sin gluten
        </p>
        <Button variant="outline" onClick={generateMenuPDF}>Descargar menú completo (PDF)</Button>
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
            height: 'auto',
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: 'white',
          },
        }}
      >
        <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2">
          ✖️
        </button>
        {modalContent}
      </Modal>
    </section>
  );
};

export default GridMenu;
