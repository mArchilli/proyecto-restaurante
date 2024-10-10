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

const ImageUpload = () => {
  // const [image, setImage] = useState(null);
  // const [previewUrl, setPreviewUrl] = useState(null);
  const [folder, setFolder] = useState("header"); // "header" como carpeta por defecto - Banner principal
  const [images, setImages] = useState([]); // Imágenes actuales en la carpeta seleccionada
  const [newImages, setNewImages] = useState({}); // Nuevas imágenes para reemplazo
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [products, setProducts] = useState([]); // Productos en Firestore
  const [selectedCategory, setSelectedCategory] = useState("header");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("bocadillos"); // Categoría por defecto
  const [filterCategory, setFilterCategory] = useState("bocadillos"); // Estado para el select de listar productos
  const navigate = useNavigate();

  useEffect(() => {
    if (folder) fetchImages(); // Cargar imágenes cada vez que cambie la carpeta seleccionada
    fetchProducts(); // Cargar productos de Firestore
  }, [folder]);

  useEffect(() => {
    fetchProducts();
  }, [filterCategory]);

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

  // Cargar productos desde Firestore filtrados por categoría
  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, "products");
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((product) => product.category === filterCategory);
      setProducts(productList);
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

  // const handleFileChange = (e) => {
  //   const selectedFile = e.target.files[0];
  //   if (selectedFile) {
  //     setImage(selectedFile);
  //     setPreviewUrl(URL.createObjectURL(selectedFile));
  //     setSuccessMessage("");
  //     setErrorMessage("");
  //   }
  // };

  // const handleImageUpload = async () => {
  //   if (image) {
  //     try {
  //       const imageName = await getImageFileName(); // Obtener el nombre del archivo
  //       const storageRef = ref(storage, `images/${folder}/${imageName}`);

  //       await deleteExistingImage(imageName);
  //       await uploadBytes(storageRef, image);
  //       const downloadURL = await getDownloadURL(storageRef);

  //       await addDoc(collection(db, "images"), {
  //         url: downloadURL,
  //         folder,
  //         timestamp: Date.now(),
  //       });

  //       setSuccessMessage(`Imagen subida exitosamente a la carpeta: ${folder}`);
  //       setErrorMessage("");
  //       fetchImages(); // Recargar imágenes para actualizar la lista
  //     } catch (error) {
  //       setErrorMessage("Error al subir la imagen. Por favor, intenta nuevamente.");
  //       setSuccessMessage("");
  //       console.error("Error:", error);
  //     }
  //   }
  // };

  // Función para generar el nombre de la imagen basado en la carpeta
  // const getImageFileName = async () => {
  //   const folderRef = ref(storage, `images/${folder}/`);
  //   const result = await listAll(folderRef);
  //   const nextImageNumber = result.items.length + 1; // Siguiente número secuencial
  //   return `${folder}${nextImageNumber}.jpg`; // Por ejemplo, bocadillo1.jpg
  // };

  // const deleteExistingImage = async (imageName) => {
  //   const storageRef = ref(storage, `images/${folder}/${imageName}`);
  //   try {
  //     await deleteObject(storageRef);
  //   } catch (error) {
  //     console.error(`Error al eliminar la imagen ${imageName}:`, error);
  //   }
  // };

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
      <div className="flex flex-col items-center mt-24 mb-24">
        <h1 className="mb-5 text-center">Panel de Administración</h1>

        <div className="flex flex-wrap justify-between w-full max-w-5xl mx-auto">
          {/* Sección de carga de imágenes */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-8 w-full ">
            <h2 className="mb-5 text-2xl">Subir Imagen</h2>

            {/* Selector para elegir la carpeta/sección */}
            <label htmlFor="folderSelect" className="mb-2">
              Selecciona la categoría:
            </label>
            <select
              id="folderSelect"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setFolder(e.target.value); // Aquí conectas la categoría seleccionada con la carpeta
              }}
              className="mb-4 border border-gray-300 rounded px-3 py-2"
            >
              <option value="header">Banner principal</option>
              <option value="about">Sobre Nosotros</option>
              <option value="bocadillos">Bocadillos</option>
              <option value="sandwiches">Sandwiches</option>
              <option value="especiales">Especiales</option>
            </select>

            {/* <input
          type="file"
          onChange={handleFileChange}
          className="mb-4"
          accept="image/*"
        />

        {previewUrl && (
          <img
            src={previewUrl}
            alt="Vista previa"
            className="mb-4 w-full h-auto max-h-40 object-contain"
          />
        )}

        <button
          onClick={handleImageUpload}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Subir Imagen
        </button> */}

            {successMessage && (
              <p className="text-green-500 mt-4">{successMessage}</p>
            )}
            {errorMessage && (
              <p className="text-red-500 mt-4">{errorMessage}</p>
            )}
          </div>

          {/* Sección de reemplazo de imágenes */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-8 w-full">
              <h2 className="mb-5 text-2xl">Reemplazar Imágenes en {folder}</h2>

              <ul className="flex flex-wrap space-x-12 mx-auto">
                {images.map((image) => (
                  <li key={image.name} className="mb-4 w-1/3"> {/* Ajusta el ancho como sea necesario */}
                    <img
                      src={image.url}
                      alt={image.name}
                      className="mb-2 w-full h-auto max-h-40 object-contain"
                    />

                    {/* Estado para la previsualización de la nueva imagen */}
                    {image.previewUrl && (
                      <img
                        src={image.previewUrl}
                        alt="Previsualización"
                        className="mb-2 w-full h-auto max-h-40 object-contain border border-dashed border-gray-400"
                      />
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChangeMenu(e, image.name)}
                      className="mb-2"
                    />

                    <button
                      onClick={() => handleReplaceImage(image.name)}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Reemplazar
                    </button>
                  </li>
                ))}
              </ul>
            </div>

        </div>

        <div className="flex flex-wrap justify-between w-full max-w-5xl mx-auto">
          {/* Sección de agregar producto */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-8 w-full md:w-1/2 max-w-full md:max-w-md">
            <h2 className="mb-5 text-2xl">Agregar Producto</h2>

            <input
              type="text"
              placeholder="Nombre del Producto"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="mb-4 border border-gray-300 rounded px-3 py-2 w-full"
            />

            <input
              type="text"
              placeholder="Descripción del Producto"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="mb-4 border border-gray-300 rounded px-3 py-2 w-full"
            />

            <input
              type="number"
              placeholder="Precio del Producto"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              className="mb-4 border border-gray-300 rounded px-3 py-2 w-full"
            />

            <label htmlFor="productCategory" className="mb-2">
              Selecciona la categoría:
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
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Agregar Producto
            </button>

            {successMessage && (
              <p className="text-green-500 mt-4">{successMessage}</p>
            )}
            {errorMessage && (
              <p className="text-red-500 mt-4">{errorMessage}</p>
            )}
          </div>

          {/* Sección de lista de productos */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-8 w-full md:w-1/2 max-w-full md:max-w-md">
            <h2 className="mb-5 text-2xl">Lista de Productos</h2>

            <label htmlFor="filterCategory" className="mb-2">
              Filtrar por categoría:
            </label>
            <select
              id="filterCategory"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="mb-4 border border-gray-300 rounded px-3 py-2 w-full"
            >
              <option value="bocadillos">Bocadillos</option>
              <option value="sandwiches">Sandwiches</option>
              <option value="especiales">Especiales</option>
            </select>

            <ul>
              {filteredProducts.map((product) => (
                <li
                  key={product.id}
                  className="mb-4 flex items-center justify-between"
                >
                  {/* Contenedor de información del producto */}
                  <div className="flex-1">
                    <p className="font-bold text-lg">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      {product.description}
                    </p>
                    <p className="text-green-600 font-semibold">
                      ${product.price}
                    </p>
                  </div>

                  {/* Botón de eliminar con ícono de tacho */}
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
                    title="Eliminar" // Tooltip
                  >
                    {/* Ícono de tacho de basura */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 8a1 1 0 000 2h8a1 1 0 100-2H6zm2-3a1 1 0 000 2h4a1 1 0 100-2H8z"
                        clipRule="evenodd"
                      />
                      <path d="M4 5a2 2 0 012-2h8a2 2 0 012 2v1H4V5zM5 9v8a2 2 0 002 2h6a2 2 0 002-2V9H5z" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          onClick={goToHome}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Volver al Inicio
        </button>
      </div>
    </>
  );
};

export default ImageUpload;
