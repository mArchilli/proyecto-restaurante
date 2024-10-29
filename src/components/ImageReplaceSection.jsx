const ImageReplaceSection = ({ images, handleFileChangeMenu, handleReplaceImage }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8 w-full">
      <h2 className="mb-5 text-2xl">Reemplazar Imágenes</h2>
      <ul className="flex flex-wrap gap-8 justify-center mx-auto mt-8">
        {images.map((image) => (
          <li
            key={image.name}
            className="mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-white shadow-lg rounded-lg p-4 border border-gray-200"
          >
            <img src={image.url} alt={image.name} className="w-full max-h-60 object-contain rounded-md" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChangeMenu(e, image.name)}
              className="mb-4 w-full cursor-pointer text-gray-700 text-sm"
            />
            <button
              onClick={() => handleReplaceImage(image.name)}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md w-full"
            >
              Reemplazar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImageReplaceSection;
