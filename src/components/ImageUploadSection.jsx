const ImageUploadSection = ({ selectedCategory, setFolder, setSelectedCategory, successMessage, errorMessage }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-8 w-full mx-auto">
      <h2 className="mb-5 text-2xl font-semibold text-gray-800">Seccion</h2>
      
      <label htmlFor="folderSelect" className="mb-2 text-gray-600 font-medium">
        Selecciona las imagenes que queres ver:
      </label>
      <select
        id="folderSelect"
        value={selectedCategory}
        onChange={(e) => {
          setSelectedCategory(e.target.value);
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
    </div>
  );
};

export default ImageUploadSection;
