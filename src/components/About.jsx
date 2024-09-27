

const About = () => {
  return (
    <section id="about" className="w-full py-6 md:py-12 lg:py-16">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <h2>Insertar Imagen</h2>
          <div className="flex flex-col justify-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Conoce Tosca La Fundicion</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Fundada en 2010, Gourmet Haven lleva más de una década sirviendo cocina exquisita a los entusiastas de la comida. Nuestra pasión por la excelencia culinaria y el compromiso de utilizar los mejores ingredientes locales nos distinguen.
            </p>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Dirigido por la galardonada chef María Rodríguez, nuestro equipo de cocina elabora cada plato con precisión y creatividad, garantizando una experiencia gastronómica inolvidable para cada huésped.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;