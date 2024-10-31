// import ImageUploadSection from "./ImageUploadSection";
import ImageReplaceSection from "./ImageReplaceSection";
import AboutSection from "./AboutSection";
import ProductSection from "./ProductSection";
import Notification from "./Notification";
import UploadPDF from "./UploadPdf";
import { useState, useEffect } from "react";
import { storage, db } from "../services/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import { Button } from './ui/Button';


const ImageUpload = () => {

  const [folder, setFolder] = useState("header"); // "header" como carpeta por defecto - Banner principal
  const [images, setImages] = useState([]); // Imágenes actuales en la carpeta seleccionada
  const [newImages, setNewImages] = useState({}); // Nuevas imágenes para reemplazo
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [products, setProducts] = useState([]); // Productos en Firestore
  const [aboutText, setAboutText] = useState();
  const [submittedContent, setSubmittedContent] = useState(null); // Estado para mostrar el contenido guardado
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("bocadillos"); // Categoría por defecto
  const [filterCategory, setFilterCategory] = useState("bocadillos"); // Estado para el select de listar productos
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);

  

  useEffect(() => {
    if (folder) fetchImages(); // Cargar imágenes cada vez que cambie la carpeta seleccionada
    fetchProducts(); // Cargar productos de Firestore
  }, [folder]);

  useEffect(() => {
    fetchProducts();
  }, [filterCategory]);

  // Llama a la función fetchSubmittedContent cuando se cargue el componente
  useEffect(() => {
    fetchSubmittedContent();
  }, []);

  // Función para cargar las imágenes de la carpeta seleccionada
  const fetchImages = async () => {
    try {
      const folderRef = ref(storage, `images/${folder}/`);
      const result = await listAll(folderRef);
      const imageUrls = await Promise.all(
        result.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return { name: itemRef.name, url };
        })
      );
      setImages(imageUrls);
    } catch (error) {
      console.error(
        `Error al cargar las imágenes de la carpeta ${folder}:`,
        error
      );
      setErrorMessage(`Error al cargar las imágenes de la carpeta ${folder}.`);
    }
  };

  // Llama a la función para cargar todos los productos
  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, "products");
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
      setAllProducts(productList); // Almacena todos los productos
    } catch (error) {
      setErrorMessage("Error al cargar los productos.", error.errorMessage);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, "products", productId));
      setSuccessMessage("Producto eliminado exitosamente.");
      fetchProducts(); // Recargar productos
    } catch (error) {
      setErrorMessage("Error al eliminar el producto.", error.errorMessage);
    }
  };

  const handleFileChangeMenu = (e, imageName) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setNewImages((prev) => ({ ...prev, [imageName]: selectedFile }));
    }
  };

  const handleReplaceImage = async (imageName) => {
    if (newImages[imageName]) {
      try {
        const storageRef = ref(storage, `images/${folder}/${imageName}`);
        await deleteObject(storageRef);
        await uploadBytes(storageRef, newImages[imageName]);
        const downloadURL = await getDownloadURL(storageRef);

        // Actualizar Firestore si es necesario
        await addDoc(collection(db, "images"), {
          url: downloadURL,
          folder,
          timestamp: Date.now(),
        });

        setSuccessMessage(`Imagen "${imageName}" reemplazada exitosamente.`);
        setErrorMessage("");
        setNewImages((prev) => ({ ...prev, [imageName]: null }));

        // Actualizar las imágenes mostradas
        setImages((prev) =>
          prev.map((img) =>
            img.name === imageName ? { ...img, url: downloadURL } : img
          )
        );
      } catch (error) {
        setErrorMessage(`Error al reemplazar la imagen "${imageName}".`);
        setSuccessMessage("");
        console.error("Error:", error);
      }
    }
  };

  // Maneja el envío del formulario SobreNosotros
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (aboutText.trim() === '') {
      alert('Por favor, escribe algo en el textarea.');
      return;
    }
  
    try {
      // Obtener todos los documentos de la colección sobreNosotros
      const querySnapshot = await getDocs(collection(db, 'sobreNosotros'));
      
      // Eliminar todos los documentos existentes
      const deletePromises = querySnapshot.docs.map(doc => {
        return deleteDoc(doc.ref);  // Eliminar cada documento
      });
      
      // Esperar a que todas las eliminaciones se completen
      await Promise.all(deletePromises);
  
      // Agregar el nuevo contenido a Firebase Firestore
      const docRef = await addDoc(collection(db, 'sobreNosotros'), {
        content: aboutText
      });
  
      console.log('Documento escrito con ID: ', docRef.id);
      setAboutText('');  // Limpia el textarea después de enviar
      fetchSubmittedContent();  // Actualiza el contenido guardado
    } catch (e) {
      console.error('Error al agregar el documento: ', e);
    }
  };
  

  // Función para obtener el contenido guardado en Firebase
  const fetchSubmittedContent = async () => {
    const querySnapshot = await getDocs(collection(db, 'sobreNosotros'));
    const contents = querySnapshot.docs.map(doc => doc.data());
    if (contents.length > 0) {
      setSubmittedContent(contents[0].content);  // Mostrar solo el primer documento por simplicidad
    }
  };

  const handleAddProduct = async () => {
    if (productName && productDescription && productPrice) {
      try {
        await addDoc(collection(db, "products"), {
          name: productName,
          description: productDescription,
          price: parseFloat(productPrice),
          category: productCategory,
          timestamp: Date.now(),
        });

        setSuccessMessage("Producto agregado exitosamente.");
        setErrorMessage("");
        fetchProducts(); // Recargar productos para actualizar la lista

        // Limpiar campos después de agregar el producto
        setProductName("");
        setProductDescription("");
        setProductPrice("");
      } catch (error) {
        setErrorMessage(
          "Error al agregar el producto. Por favor, intenta nuevamente."
        );
        setSuccessMessage("");
        console.error("Error:", error);
      }
    } else {
      setErrorMessage("Por favor, completa todos los campos.");
    }
  };

 const goToHome = () => {
   navigate("/"); // Navega a la página de inicio
 };

  const filteredProducts = products.filter(
    (product) => product.category === filterCategory
  );
  

  
  return (
    <>
      <AdminNavbar />
      <div className="flex flex-col items-center mt-24 mb-24 container mx-auto">
        <h1 className="mb-5 text-center">Panel de Administración</h1>
        
        {/* <ImageUploadSection
          selectedCategory={selectedCategory}
          setFolder={setFolder}
          setSelectedCategory={setSelectedCategory}
          successMessage={successMessage}
          errorMessage={errorMessage}
        /> */}
        
        <ImageReplaceSection
          setFolder={setFolder}
          successMessage={successMessage}
          errorMessage={errorMessage}
          images={images}
          handleFileChangeMenu={handleFileChangeMenu}
          handleReplaceImage={handleReplaceImage}
        />
        
        <AboutSection
          aboutText={aboutText}
          setAboutText={setAboutText}
          handleSubmit={handleSubmit}
          submittedContent={submittedContent}
        />

        <UploadPDF/>
        
        <ProductSection
          productName={productName}
          setProductName={setProductName}
          productDescription={productDescription}
          setProductDescription={setProductDescription}
          productPrice={productPrice}
          setProductPrice={setProductPrice}
          productCategory={productCategory}
          setProductCategory={setProductCategory}
          handleAddProduct={handleAddProduct}
          filteredProducts={filteredProducts}
          handleDeleteProduct={handleDeleteProduct}
          allProducts={allProducts}
          setFilterCategory={setFilterCategory}
        />
        
        <Notification successMessage={successMessage} errorMessage={errorMessage} />

        {/* <button
          className="mb-5 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={goToHome}
        >
          Volver al sitio
        </button> */}

        <Button variant="outline"  onClick={goToHome}> Volver al sitio</Button>
        
      </div>
    </>
  );
 
};

export default ImageUpload;
