import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import Modal from 'react-modal';
import { Button } from './ui/Button';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const resizeAndCropImage = (imageSrc, crop, resolution) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Establecer las dimensiones del canvas basadas en la resolución deseada
      canvas.width = resolution.width;
      canvas.height = resolution.height;

      const scaleX = img.width / img.naturalWidth; // Escala para obtener la relación correcta
      const scaleY = img.height / img.naturalHeight; // Escala para obtener la relación correcta

      // Ajustar el recorte
      ctx.drawImage(
        img,
        crop.x / scaleX, // Ajustar la posición del recorte en el eje X
        crop.y / scaleY, // Ajustar la posición del recorte en el eje Y
        crop.width / scaleX, // Ajustar el ancho del recorte
        crop.height / scaleY, // Ajustar la altura del recorte
        0, // X en el canvas
        0, // Y en el canvas
        resolution.width, // Ancho en el canvas
        resolution.height // Alto en el canvas
      );

      // Convertir el canvas a un blob
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg');
    };

    img.onerror = (error) => reject(error);
  });
};

const ImageReplaceSection = ({ images, setFolder }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [selectedResolution, setSelectedResolution] = useState('');
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("header");
  const [imageToReplace, setImageToReplace] = useState(null);

  const storage = getStorage();

  const onCropComplete = useCallback((croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const resolutions = {
    '1920x600': { width: 1920, height: 600 },
    '800x800': { width: 800, height: 800 },
    '1200x630': { width: 1200, height: 630 },
    '400x300': { width: 400, height: 300 },
  };

  const handleSaveCroppedImage = async () => {
    if (!selectedImage || !selectedResolution || !croppedArea || !imageToReplace) return;

    try {
      const croppedImage = await resizeAndCropImage(selectedImage, croppedArea, resolutions[selectedResolution]);

      const storageRef = ref(storage, `images/${selectedFolder}/${imageToReplace}`);
      await uploadBytes(storageRef, croppedImage);
      const downloadURL = await getDownloadURL(storageRef);

      setIsCropModalOpen(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);

      console.log('Imagen subida correctamente:', downloadURL);
    } catch (error) {
      console.error('Error al recortar y reemplazar la imagen:', error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-8 w-full mx-auto">
      <h2 className="mb-5 text-2xl font-semibold text-gray-800">Sección de Imágenes</h2>
      
      <label htmlFor="folderSelect" className="mb-2 text-gray-600 font-medium">
        Selecciona las imágenes que quieres ver:
      </label>
      <select
        id="folderSelect"
        value={selectedFolder}
        onChange={(e) => {
          setSelectedFolder(e.target.value);
          setFolder(e.target.value);
        }}
        className="mx-4 mb-4 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
      >
        <option value="header">Banner principal</option>
        <option value="about">Sobre Nosotros</option>
        <option value="bocadillos">Bocadillos</option>
        <option value="sandwiches">Sandwiches</option>
        <option value="especiales">Especiales</option>
      </select>

      {isSaved && (
        <p className="text-green-600 bg-green-100 border border-green-300 rounded-md p-2 mb-4">
          ¡Imagen guardada correctamente!
        </p>
      )}

      <h2 className="mb-5 text-2xl font-semibold text-gray-800">Reemplazar Imágenes</h2>
      <ul className="flex flex-wrap gap-8 justify-center mx-auto mt-8">
        {images.map((image) => (
          <li key={image.name} className="mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-white shadow-lg rounded-lg p-4 border border-gray-200">
            <img src={image.url} alt={image.name} className="w-full max-h-60 object-contain rounded-md" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = () => setSelectedImage(reader.result);
                reader.readAsDataURL(file);
              }}
              className="my-4 w-full cursor-pointer text-gray-700 text-sm"
            />

            <select
              value={selectedResolution}
              onChange={(e) => setSelectedResolution(e.target.value)}
              className="my-4 w-full border rounded p-2 text-gray-700"
            >
              <option value="" disabled>Seleccionar Resolución</option>
              {Object.keys(resolutions).map((res) => (
                <option key={res} value={res}>{res}</option>
              ))}
            </select>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setImageToReplace(image.name);
                setIsCropModalOpen(true);
              }}
              disabled={!selectedResolution || !selectedImage}
            >
              Recortar Imagen
            </Button>

            <Modal
              isOpen={isCropModalOpen}
              onRequestClose={() => setIsCropModalOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
              ariaHideApp={false} 
            >
              <div className="bg-white p-4 rounded-lg w-3/4 md:w-1/2">
                <h2 className="text-xl font-semibold mb-4">Ajustar Recorte</h2>
                <div className="relative w-full h-64 mb-4">
                  <Cropper
                    image={selectedImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={selectedResolution === '1920x600' ? 1920 / 600 :
                            selectedResolution === '800x800' ? 1 :
                            selectedResolution === '1200x630' ? 1200 / 630 :
                            400 / 300}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={() => setIsCropModalOpen(false)}>Cancelar</Button>
                  <Button onClick={handleSaveCroppedImage}>Guardar Recorte</Button>
                </div>
              </div>
            </Modal>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImageReplaceSection;
