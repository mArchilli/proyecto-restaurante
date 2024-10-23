import { useEffect, useState } from 'react';
import { storage, db } from '../services/firebase'; // Asegúrate de que db esté importado desde tu configuración de Firebase
import { ref, getDownloadURL } from 'firebase/storage';
import { collection, getDocs } from 'firebase/firestore'; // Importar funciones necesarias

const About = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [aboutContent, setAboutContent] = useState(''); // Estado para almacenar el contenido de sobreNosotros

  // Función para obtener la URL de la imagen de Firebase
  const fetchImage = async () => {
    try {
      const imageRef = ref(storage, 'images/about/about1.jpg'); // Cambia 'about1.jpg' por el nombre real de tu imagen
      const url = await getDownloadURL(imageRef);
      setImageUrl(url);
    } catch (error) {
      console.error('Error al obtener la imagen de Firebase:', error);
    }
  };

  // Función para obtener el contenido de la colección sobreNosotros
  const fetchAboutContent = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'sobreNosotros'));
      querySnapshot.forEach((doc) => {
        setAboutContent(doc.data().content); // Asigna el contenido del documento al estado
      });
    } catch (error) {
      console.error('Error al obtener el contenido de sobreNosotros:', error);
    }
  };

  useEffect(() => {
    fetchImage();
    fetchAboutContent(); // Llamar a la función para obtener el contenido al cargar el componente
  }, []);

  return (
    <section id="about" className="w-full py-6 md:py-12 lg:py-16 bg-gray-100">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          {imageUrl && (
            <figure className="hidden lg:block">
              <img
                src={imageUrl}
                alt="Imagen de Tasca La Fundición"
                className="w-full h-auto rounded-lg"
              />
              <figcaption className="sr-only">Imagen de Tasca La Fundición</figcaption>
            </figure>
          )}
          <article className="space-y-4 text-center lg:text-left">
            <header>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-left">
                Sobre Nosotros
              </h2>
            </header>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto lg:mx-0">
              {aboutContent} {/* Mostrar el contenido obtenido de Firestore */}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default About;
