import { useState } from "react";
import { storage, db } from "../services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar"; // Importa el nuevo navbar de admin

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // Estado para la URL de la vista previa
  const navigate = useNavigate();

  const handleImageUpload = async () => {
    if (image) {
      const storageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(storageRef);

      // Guarda la URL en Firestore
      await addDoc(collection(db, "images"), {
        url: downloadURL,
        timestamp: Date.now(),
      });

      console.log("Imagen subida y URL guardada en Firestore:", downloadURL);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImage(selectedFile); // Guarda el archivo seleccionado en el estado
      setPreviewUrl(URL.createObjectURL(selectedFile)); // Crea la URL de la vista previa
    }
  };

  const goToHome = () => {
    navigate("/");
  };

  return (
    <>
      <AdminNavbar /> {/* Muestra el navbar para administradores */}
      <div className="flex flex-col items-center mt-24">
        <input
          type="file"
          onChange={handleFileChange} // Maneja el cambio de archivo
          className="mb-4"
        />
        {previewUrl && ( // Si hay una URL de previsualización, muestra la imagen
          <img src={previewUrl} alt="Vista previa" className="mb-4 max-w-xs" />
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
