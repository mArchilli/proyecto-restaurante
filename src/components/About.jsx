import { useEffect, useState } from 'react';
import { storage, db } from '../services/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { collection, getDocs } from 'firebase/firestore';

const About = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [aboutContent, setAboutContent] = useState('');

  const fetchImage = async () => {
    try {
      const imageRef = ref(storage, 'images/about/about1.jpg');
      const url = await getDownloadURL(imageRef);
      setImageUrl(url);
    } catch (error) {
      console.error('Error al obtener la imagen de Firebase:', error);
    }
  };

  const fetchAboutContent = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'sobreNosotros'));
      querySnapshot.forEach((doc) => {
        setAboutContent(doc.data().content);
      });
    } catch (error) {
      console.error('Error al obtener el contenido de sobreNosotros:', error);
    }
  };

  useEffect(() => {
    fetchImage();
    fetchAboutContent();
  }, []);

  return (
    <section id="about" className="w-full xl:min-h-[500px] py-14 lg:py-16  bg-gray-200">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Skeleton de la imagen */}
          {imageUrl ? (
            <figure className="hidden lg:block">
              <img
                src={imageUrl}
                alt="Imagen de Tasca La Fundición"
                className="w-full max-h-96 rounded-lg shadow-lg hover:scale-105 hover:opacity-90 transition-transform duration-300 ease-in-out"
              />
              <figcaption className="sr-only">Imagen de Tasca La Fundición</figcaption>
            </figure>
          ) : (
            <div className="hidden lg:block w-full h-[300px] bg-gray-300 rounded-lg animate-pulse"></div>
          )}

          {/* Skeleton del texto */}
          <article className="space-y-4 text-center lg:text-left">
            {aboutContent ? (<>
            <header>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl lg:text-left">
                Sobre Nosotros
              </h2>
            </header>
            
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto lg:mx-0">
                {aboutContent}
              </p>
              </>
            ) : (
              <div className="space-y-2 max-w-[600px] mx-auto lg:mx-0">
                <div className="h-8 mb-4 w-80 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded animate-pulse w-5/6"></div>
              </div>
            )}
          </article>
        </div>
      </div>
    </section>
  );
};

export default About;
