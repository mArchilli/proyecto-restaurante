import { useState, useEffect } from "react";
import { storage, db } from "../services/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [folder, setFolder] = useState("bocadillos"); // "bocadillos" como carpeta por defecto
  const [images, setImages] = useState([]); // Imágenes actuales en la carpeta seleccionada
  const [newImages, setNewImages] = useState({}); // Nuevas imágenes para reemplazo
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [products, setProducts] = useState([]); // Productos en Firestore
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("bocadillos"); // Categoría por defecto
  const navigate = useNavigate();

  useEffect(() => {
    if (folder) fetchImages(); // Cargar imágenes cada vez que cambie la carpeta seleccionada
    fetchProducts(); // Cargar productos de Firestore
  }, [folder]);

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
      console.error(`Error al cargar las imágenes de la carpeta ${folder}:`, error);
      setErrorMessage(`Error al cargar las imágenes de la carpeta ${folder}.`);
    }
  };

  // Función para cargar productos desde Firestore
  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, "products");
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    } catch (error) {
      console.error("Error al cargar los productos:", error);
      setErrorMessage("Error al cargar los productos.");
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
          prev.map((img) => (img.name === imageName ? { ...img, url: downloadURL } : img))
        );
      } catch (error) {
        setErrorMessage(`Error al reemplazar la imagen "${imageName}".`);
        setSuccessMessage("");
        console.error("Error:", error);
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImage(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setSuccessMessage("");
      setErrorMessage("");
    }
  };

  const handleImageUpload = async () => {
    if (image) {
      try {
        const imageName = await getImageFileName(); // Obtener el nombre del archivo
        const storageRef = ref(storage, `images/${folder}/${imageName}`);

        await deleteExistingImage(imageName);
        await uploadBytes(storageRef, image);
        const downloadURL = await getDownloadURL(storageRef);

        await addDoc(collection(db, "images"), {
          url: downloadURL,
          folder,
          timestamp: Date.now(),
        });

        setSuccessMessage(`Imagen subida exitosamente a la carpeta: ${folder}`);
        setErrorMessage("");
        fetchImages(); // Recargar imágenes para actualizar la lista
      } catch (error) {
        setErrorMessage("Error al subir la imagen. Por favor, intenta nuevamente.");
        setSuccessMessage("");
        console.error("Error:", error);
      }
    }
  };

  // Función para generar el nombre de la imagen basado en la carpeta
  const getImageFileName = async () => {
    const folderRef = ref(storage, `images/${folder}/`);
    const result = await listAll(folderRef);
    const nextImageNumber = result.items.length + 1; // Siguiente número secuencial
    return `${folder}${nextImageNumber}.jpg`; // Por ejemplo, bocadillo1.jpg
  };

  const deleteExistingImage = async (imageName) => {
    const storageRef = ref(storage, `images/${folder}/${imageName}`);
    try {
      await deleteObject(storageRef);
    } catch (error) {
      console.error(`Error al eliminar la imagen ${imageName}:`, error);
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
        setErrorMessage("Error al agregar el producto. Por favor, intenta nuevamente.");
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

  return (
    <>
      <AdminNavbar />
      <div className="flex flex-col items-center mt-24">
        <h1 className="mb-5">Panel de Administración</h1>

        {/* Sección de carga de imágenes */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8 w-full max-w-md">
          <h2 className="mb-5 text-2xl">Subir Imagen</h2>

          {/* Selector para elegir la carpeta/sección */}
          <label htmlFor="folderSelect" className="mb-2">
            Selecciona la categoría:
          </label>
          <select
            id="folderSelect"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="mb-4 border border-gray-300 rounded px-3 py-2"
          >
            <option value="header">Banner principal</option>
            <option value="about">Sobre nosotros</option>
            <option value="bocadillos">Bocadillos</option>
            <option value="sandwiches">Sandwiches y Tostadas</option>
            <option value="especiales">Especiales</option>
          </select>

          {/* Campo de entrada para archivos */}
          <input
            type="file"
            onChange={handleFileChange}
            className="mb-4 border border-gray-300 rounded px-3 py-2"
          />
          {previewUrl && (
            <img src={previewUrl} alt="Vista previa" className="mb-4 max-w-xs rounded" />
          )}
          {successMessage && (
            <p className="text-green-500 mb-4">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="text-red-500 mb-4">{errorMessage}</p>
          )}
          <button
            onClick={handleImageUpload}
            className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
          >
            Subir Imagen
          </button>
        </div>

        {/* Sección para ver imágenes */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8 w-full max-w-md">
          <h2 className="mb-5 text-2xl">Imágenes en {folder}</h2>
          {images.length === 0 ? (
            <p>No hay imágenes en esta carpeta.</p>
          ) : (
            images.map((image) => (
              <div key={image.name} className="mb-4">
                <img src={image.url} alt={image.name} className="max-w-xs rounded" />
                <div className="flex justify-between">
                  <span>{image.name}</span>
                  <input
                    type="file"
                    onChange={(e) => handleFileChangeMenu(e, image.name)}
                    className="border border-gray-300 rounded px-2"
                  />
                  <button
                    onClick={() => handleReplaceImage(image.name)}
                    className="bg-blue-500 text-white py-1 px-2 rounded"
                  >
                    Reemplazar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sección para agregar productos */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8 w-full max-w-md">
          <h2 className="mb-5 text-2xl">Agregar Producto</h2>

          <label htmlFor="productName" className="mb-2">
            Nombre del producto:
          </label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="mb-4 border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="Nombre del producto"
          />

          <label htmlFor="productDescription" className="mb-2">
            Descripción del producto:
          </label>
          <textarea
            id="productDescription"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            className="mb-4 border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="Descripción del producto"
          />

          <label htmlFor="productPrice" className="mb-2">
            Precio del producto:
          </label>
          <input
            type="number"
            id="productPrice"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            className="mb-4 border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="Precio del producto"
          />

          <label htmlFor="productCategory" className="mb-2">
            Categoría:
          </label>
          <select
            id="productCategory"
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
            className="mb-4 border border-gray-300 rounded px-3 py-2 w-full"
          >
            <option value="bocadillos">Bocadillos</option>
            <option value="sandwiches">Sandwiches</option>
            <option value="especiales">Especiales</option>
          </select>

          <button
            onClick={handleAddProduct}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Agregar Producto
          </button>
          {successMessage && (
            <p className="text-green-500 mb-4">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="text-red-500 mb-4">{errorMessage}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ImageUpload;
