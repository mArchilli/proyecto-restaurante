// ImageUpload.js
import { useState } from "react";
import { storage, db } from "./firebase"; // Importa Firebase Storage y Firestore
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";

const ImageUpload = () => {
  const [image, setImage] = useState(null);

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

  return (
    <div>
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={handleImageUpload}>Subir Imagen</button>
    </div>
  );
};

export default ImageUpload;
