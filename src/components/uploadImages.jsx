import { useState } from "react";
import { storage, db } from "../services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [folder, setFolder] = useState("header");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Función que asigna el nombre del archivo según la carpeta
  const getImageFileName = () => {
    switch (folder) {
      case "header":
        return "header-imagen.jpg";
      case "contact":
        return "contact-imagen.jpg";
      case "gallery":
        return "gallery-imagen.jpg";
      case "footer":
        return "footer-imagen.jpg";
      default:
        return "default-imagen.jpg"; // Nombre genérico para carpetas adicionales
    }
  };

  const handleImageUpload = async () => {
    if (image) {
      try {
        const imageName = getImageFileName(); // Obtiene el nombre predeterminado
        const storageRef = ref(storage, `images/${folder}/${imageName}`);
        await uploadBytes(storageRef, image);
        const downloadURL = await getDownloadURL(storageRef);

        // Guarda la URL y la carpeta en Firestore
        await addDoc(collection(db, "images"), {
          url: downloadURL,
          folder: folder,
          timestamp: Date.now(),
        });

        setSuccessMessage(`Imagen subida exitosamente a la carpeta: ${folder}`);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage("Error al subir la imagen. Por favor, intenta nuevamente.", error.errorMessage);
        setSuccessMessage("");
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

  const goToHome = () => {
    navigate("/");
  };

  return (
    <>
      <AdminNavbar />
      <div className="flex flex-col items-center mt-24">
        <h1 className="mb-5">Panel de Administración</h1>
        <h2 className="mb-5 text-2xl">Subir Imagen</h2>

        {/* Selector para elegir la carpeta/sección */}
        <label htmlFor="folderSelect" className="mb-2">Selecciona la sección donde se subirá la imagen:</label>
        <select
          id="folderSelect"
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
          className="mb-4 border border-gray-300 rounded px-3 py-2"
        >
          <option value="header">Header</option>
          <option value="contact">Contacto</option>
          <option value="gallery">Galería</option>
          <option value="footer">Footer</option>
        </select>

        <input
          type="file"
          onChange={handleFileChange}
          className="mb-4"
        />

        {previewUrl && (
          <img src={previewUrl} alt="Vista previa" className="mb-4 max-w-xs" />
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

        <button
          onClick={goToHome}
          className="bg-gray-500 text-white py-2 px-4 rounded"
        >
          Volver al Inicio
        </button>
      </div>
    </>
  );
};

export default ImageUpload;
