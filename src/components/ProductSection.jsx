import { useState } from 'react';
import { Button } from './ui/Button';

const ProductSection = ({
  productName,
  setProductName,
  productDescription,
  setProductDescription,
  productPrice,
  setProductPrice,
  productCategory,
  setProductCategory,
  handleAddProduct,
  handleDeleteProduct,
  allProducts // Asegúrate de pasar todos los productos
}) => {
  const [filterCategory, setFilterCategory] = useState("bocadillos");

  // Filtrar productos según la categoría seleccionada
  const filteredByCategory = allProducts ? allProducts.filter(product => 
    product.category === filterCategory
  ) : [];

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <div className="bg-gray-200 shadow-md rounded-lg p-6 mb-8 w-full md:w-1/2">
        <h2 className="mb-5 text-2xl font-semibold text-gray-800">Gestión de Productos</h2>

        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Nombre del producto"
          className="mb-4 p-2 border rounded w-full"
        />
        <textarea
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          placeholder="Descripción del producto"
          className="mb-4 p-2 border rounded w-full"
        />
        <input
          type="number"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          placeholder="Precio del producto"
          className="mb-4 p-2 border rounded w-full"
        />
        <select
          value={productCategory}
          onChange={(e) => setProductCategory(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
        >
          <option value="bocadillos">Bocadillos</option>
          <option value="sandwiches">Sandwiches</option>
          <option value="especiales">Especiales</option>
        </select>
        {/* <button onClick={handleAddProduct} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
          Agregar Producto
        </button> */}
        <Button variant="outline" className='w-full'  onClick={handleAddProduct}> Guardar</Button>
      </div>

      <div className="bg-gray-200 shadow-md rounded-lg p-6 mb-8 w-full md:w-1/2">
        <h2 className="mb-5 text-2xl font-semibold text-gray-800">Lista de Productos</h2>

        <label htmlFor="filterCategory" className="mb-2">
          Filtrar por categoría:
        </label>
        <select
          id="filterCategory"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="mb-4 border border-gray-300 rounded px-3 py-2 w-full"
        >
          <option value="bocadillos">Bocadillos</option>
          <option value="sandwiches">Sandwiches</option>
          <option value="especiales">Especiales</option>
        </select>

        <ul>
          {filteredByCategory.map((product) => (
            <li
              key={product.id}
              className="mb-4 flex items-center justify-between"
            >
              <div className="flex-1">
                <p className="font-bold text-lg">{product.name}</p>
                <p className="text-sm text-gray-600">
                  {product.description}
                </p>
                <p className="text-green-600 font-semibold">
                  €{product.price}
                </p>
              </div>

              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
                title="Eliminar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 8a1 1 0 000 2h8a1 1 0 100-2H6zm2-3a1 1 0 000 2h4a1 1 0 100-2H8z"
                    clipRule="evenodd"
                  />
                  <path d="M4 5a2 2 0 012-2h8a2 2 0 012 2v1H4V5zM5 9v8a2 2 0 002 2h6a2 2 0 002-2V9H5z" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductSection;
