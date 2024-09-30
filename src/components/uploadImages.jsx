import { useState, useEffect } from "react";
import { storage, db } from "../services/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [folder, setFolder] = useState("header"); // Mantener "header" como carpeta por defecto
  const [images, setImages] = useState([]); // Para previsualizar imágenes de la carpeta "menu"
  const [newImages, setNewImages] = useState({}); // Almacenar los archivos que serán reemplazados
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchImages(); // Cargar imágenes al iniciar
  }, []); // No dependemos del "folder" aquí

  // Cargar imágenes de la carpeta "menu" automáticamente
  const fetchImages = async () => {
    try {
      const folderRef = ref(storage, `images/menu/`); // Solo cargamos de "menu"
      const result = await listAll(folderRef);
      const imageUrls = await Promise.all(
        result.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return { name: itemRef.name, url };
        })
      );
      setImages(imageUrls);
    } catch (error) {
      console.error("Error al cargar las imágenes:", error);
      setErrorMessage("Error al cargar las imágenes.");
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
        const storageRef = ref(storage, `images/menu/${imageName}`);
        await deleteObject(storageRef);
        await uploadBytes(storageRef, newImages[imageName]);
        const downloadURL = await getDownloadURL(storageRef);

        // Actualizar Firestore si es necesario
        await addDoc(collection(db, "images"), {
          url: downloadURL,
          folder: "menu",
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
        const imageName = getImageFileName();
        const storageRef = ref(storage, `images/${folder}/${imageName}`);

        await deleteExistingImage();
        await uploadBytes(storageRef, image);
        const downloadURL = await getDownloadURL(storageRef);

        await addDoc(collection(db, "images"), {
          url: downloadURL,
          folder: folder,
          timestamp: Date.now(),
        });

        setSuccessMessage(`Imagen subida exitosamente a la carpeta: ${folder}`);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage("Error al subir la imagen. Por favor, intenta nuevamente.");
        setSuccessMessage("");
        console.error("Error:", error);
      }
    }
  };

  const getImageFileName = () => {
    return `${folder}-imagen.jpg`; // Nombre genérico basado en la carpeta seleccionada
  };

  const deleteExistingImage = async () => {
    const imageName = getImageFileName();
    const storageRef = ref(storage, `images/${folder}/${imageName}`);

    try {
      await deleteObject(storageRef); // Elimina la imagen existente
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
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
            Selecciona la sección donde se subirá la imagen:
          </label>
          <select
            id="folderSelect"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="mb-4 border border-gray-300 rounded px-3 py-2"
          >
            <option value="header">Header</option>
            <option value="contact">Contacto</option>
            <option value="footer">Footer</option>
            <option value="menu">Menu</option>
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

        {/* Sección de imágenes del menú */}
        <div className="bg-gray-100 rounded-lg p-6 w-full max-w-4xl">
          <h2 className="text-2xl mb-4">Imágenes del Menú</h2>
          {/* Mostrar las imágenes existentes de la carpeta "menu" */}
          {images.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 mb-8">
              {images.map((image) => (
                <div key={image.name} className="flex flex-col items-center border border-gray-300 rounded py-4 px-20">
                  <img src={image.url} alt={image.name} className="mb-2 w-40 h-40 object-cover rounded" />
                  <input
                    type="file"
                    onChange={(e) => handleFileChangeMenu(e, image.name)}
                    className="mb-2 border border-gray-300 rounded px-3 py-2"
                  />
                  <button
                    onClick={() => handleReplaceImage(image.name)}
                    className="bg-blue-500 text-white py-1 px-3 rounded"
                    disabled={!newImages[image.name]} // Deshabilitar si no hay nueva imagen seleccionada
                  >
                    Reemplazar Imagen
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay imágenes en la carpeta menu actualmente.</p>
          )}
        </div>

        <button
          onClick={goToHome}
          className="bg-gray-500 text-white py-2 px-4 rounded mt-4"
        >
          Volver al Inicio
        </button>
      </div>
    </>
  );
};

export default ImageUpload;
