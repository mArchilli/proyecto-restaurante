import { useState } from 'react';
import { Button } from './ui/Button';

// Función para redimensionar la imagen
const resizeImage = (file, resolution) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      let width, height;

      // Establecer las dimensiones según la resolución seleccionada
      if (resolution === '816x240') {
        width = 816;
        height = 240;
      } else if (resolution === '400x240') {
        width = 400;
        height = 240;
      } else {
        reject(new Error('Resolución no válida'));
        return;
      }

      // Crear un canvas para redimensionar la imagen
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Convertir el canvas a un archivo de imagen
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg'); // Cambia el tipo si es necesario
    };

    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const ImageReplaceSection = ({ images, handleFileChangeMenu, handleReplaceImage,  setFolder, successMessage, errorMessage }) => {
  const [selectedResolution, setSelectedResolution] = useState('');
  const [selectedCategorySelect, setSelectedCategoryState] = useState(''); // Nuevo estado para almacenar la categoría seleccionada

  const resolutions = [
    { label: '816 x 240', value: '816x240' },
    { label: '400 x 240', value: '400x240' },
  ];

  const handleImageReplace = async (imageName, file) => {
    try {
      const resizedImage = await resizeImage(file, selectedResolution);
      handleReplaceImage(imageName, resizedImage, selectedResolution);
    } catch (error) {
      console.error('Error al redimensionar la imagen:', error);
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
        value={selectedCategorySelect}
        onChange={(e) => {
          setSelectedCategoryState(e.target.value); // Actualiza el estado de la categoría seleccionada
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
      
      {successMessage && (
        <p className="text-green-600 bg-green-100 border border-green-300 rounded-md p-2 mb-4">
          {successMessage}
        </p>
      )}
      {errorMessage && (
        <p className="text-red-600 bg-red-100 border border-red-300 rounded-md p-2 mb-4">
          {errorMessage}
        </p>
      )}

      <h2 className="mb-5 text-2xl font-semibold text-gray-800">Reemplazar Imágenes</h2>
      <ul className="flex flex-wrap gap-8 justify-center mx-auto mt-8">
        {images.map((image) => {
          // Mostrar el select de dimensiones solo si la categoría seleccionada es "bocadillos", "especiales" o "sandwiches"
          const showResolutionSelect = ['bocadillos', 'especiales', 'sandwiches'].includes(selectedCategorySelect);

          return (
            <li
              key={image.name}
              className="mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-white shadow-lg rounded-lg p-4 border border-gray-200 flex flex-col justify-between"
            >
              <img src={image.url} alt={image.name} className="w-full max-h-60 object-contain rounded-md" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChangeMenu(e, image.name)}
                className="my-4 w-full cursor-pointer text-gray-700 text-sm"
              />
              
              {showResolutionSelect && (
                <select
                  value={selectedResolution}
                  onChange={(e) => setSelectedResolution(e.target.value)}
                  className="my-4 w-full border rounded p-2 text-gray-700"
                >
                  <option value="" disabled>Select Resolution</option>
                  {resolutions.map((res) => (
                    <option key={res.value} value={res.value}>{res.label}</option>
                  ))}
                </select>
              )}

              <Button
                variant="outline"
                className='w-full'
                onClick={(e) => handleImageReplace(image.name, e.target.previousElementSibling.files[0])}
                disabled={!selectedResolution && showResolutionSelect}
              >
                Reemplazar
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ImageReplaceSection;
