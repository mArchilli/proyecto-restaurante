export default function Contact() {
  return (
    <section className="bg-gray-100 py-12" id="contact">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Visítanos</h2>
        <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Sección del mapa */}
          <div className="w-full md:w-1/2 h-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3081.5091599336915!2d-0.39175340000000003!3d39.435222499999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd604edd225db98f%3A0x6316b22c4050cf1d!2sTasca%20La%20Fundicion!5e0!3m2!1ses-419!2sar!4v1727796211063!5m2!1ses-419!2sar"
              width="100%"
              height="290px"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Ubicación de Restaurante"
            ></iframe>
          </div>
          
          {/* Sección de contacto */}
          <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-md h-full">
            <h3 className="text-xl font-semibold mb-4">Nuestra ubicación</h3>
            <address className="not-italic mb-4">
              <p className="mb-2">123 Restaurant Street</p>
              <p className="mb-2">New York, NY 10001</p>
              <p>United States</p>
            </address>
            <h4 className="text-lg font-semibold mb-2">Horarios de atención</h4>
            <ul className="space-y-1">
              <li>Lunes - Viernes: 11:00 AM - 10:00 PM</li>
              <li>Sábado - Domingo: 10:00 AM - 11:00 PM</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
