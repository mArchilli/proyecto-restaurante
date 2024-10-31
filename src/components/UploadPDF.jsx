import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../services/firebase';
import { Button } from './ui/Button';

const UploadPDF = () => {
  const [pdfFile, setPdfFile] = useState(null);  // Estado para el archivo PDF
  const [pdfUrl, setPdfUrl] = useState(null);    // Estado para la URL del archivo PDF en Firebase
  const pdfRef = ref(storage, 'pdfs/menu.pdf');  // Referencia en Firebase Storage para el archivo único

  // Función para manejar la carga del archivo
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert('Por favor, selecciona un archivo PDF.');
    }
  };

  // Función para subir el archivo PDF a Firebase Storage
  const handleUpload = async () => {
    if (!pdfFile) return alert('Selecciona un archivo PDF para cargar.');
    
    try {
      // Eliminar el archivo PDF existente, si lo hay
      await deleteObject(pdfRef).catch(() => console.log('No hay archivo existente para reemplazar.'));
      
      // Subir el nuevo archivo PDF
      await uploadBytes(pdfRef, pdfFile);
      const url = await getDownloadURL(pdfRef); // Obtener la URL del archivo subido
      setPdfUrl(url);
      alert('Archivo PDF subido y reemplazado exitosamente.');
    } catch (error) {
      console.error('Error al cargar el archivo PDF:', error);
    }
  };

  // Obtener el enlace de descarga del archivo PDF al cargar el componente
  React.useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const url = await getDownloadURL(pdfRef);
        setPdfUrl(url);
      } catch (error) {
        console.log('No se encontró un archivo PDF existente.', error);
      }
    };

    fetchPdfUrl();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8 w-full">
      <h2 className="mb-5 text-2xl font-semibold text-gray-800">Cargar/Actualizar Menú PDF</h2>

      {pdfUrl ? (
        <div className="mb-4">
          <p className="text-sm text-gray-600">Archivo PDF Actual:</p>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            Ver Menú PDF
          </a>
        </div>
      ) : (
        <p className="text-sm text-gray-600 mb-4">No hay un archivo PDF cargado actualmente.</p>
      )}

      <input type="file" accept="application/pdf" onChange={handleFileChange} className="mb-4" />
      <Button onClick={handleUpload} variant="outline" className="w-full">
        Subir/Reemplazar PDF
      </Button>
    </div>
  );
};

export default UploadPDF;
