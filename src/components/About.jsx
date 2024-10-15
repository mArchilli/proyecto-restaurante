import { useEffect, useState } from 'react';
import { storage } from '../services/firebase';
import { ref, getDownloadURL } from 'firebase/storage';

const About = () => {
  const [imageUrl, setImageUrl] = useState('');

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

  useEffect(() => {
    fetchImage();
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
              Fundada en 2010, Gourmet Haven lleva más de una década sirviendo cocina exquisita a los entusiastas de la comida. Nuestra pasión por la excelencia culinaria y el compromiso de utilizar los mejores ingredientes locales nos distinguen.
            </p>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto lg:mx-0">
              Dirigido por la galardonada chef María Rodríguez, nuestro equipo de cocina elabora cada plato con precisión y creatividad, garantizando una experiencia gastronómica inolvidable para cada huésped.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default About;
