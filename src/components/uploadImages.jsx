import { useState } from "react";
import { storage, db } from "../services/firebase"; // Importa Firebase Storage y Firestore
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para la redirección

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const navigate = useNavigate(); // Inicializa useNavigate para la redirección

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

  // Función para redirigir al inicio
  const goToHome = () => {
    navigate("/"); // Redirige a la raíz del sitio (inicio)
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        className="mb-4"
      />
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
  );
};

export default ImageUpload;
