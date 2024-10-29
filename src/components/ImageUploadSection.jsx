

const ImageUploadSection = ({ selectedCategory, setFolder, setSelectedCategory, successMessage, errorMessage }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8 w-full">
      <h2 className="mb-5 text-2xl">Subir Imagen</h2>
      
      <label htmlFor="folderSelect" className="mb-2">
        Selecciona la categoría:
      </label>
      <select
        id="folderSelect"
        value={selectedCategory}
        onChange={(e) => {
          setSelectedCategory(e.target.value);
          setFolder(e.target.value);
        }}
        className="mb-4 border border-gray-300 rounded px-3 py-2"
      >
        <option value="header">Banner principal</option>
        <option value="about">Sobre Nosotros</option>
        <option value="bocadillos">Bocadillos</option>
        <option value="sandwiches">Sandwiches</option>
        <option value="especiales">Especiales</option>
      </select>
      
      {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
    </div>
  );
};

export default ImageUploadSection;
