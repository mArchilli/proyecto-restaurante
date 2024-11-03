import { Button } from './ui/Button';

const AboutSection = ({ aboutText, setAboutText, handleSubmit, submittedContent }) => {
  return (
    <div className="bg-gray-200 shadow-md rounded-lg p-6 mb-8 w-full ">
      <h2 className="mb-5 text-2xl font-semibold text-gray-800">Sección Sobre Nosotros</h2>
      <textarea
        value={aboutText}
        onChange={(e) => setAboutText(e.target.value)}
        className="w-full h-40 p-2 border border-gray-300 rounded"
        placeholder="Escribe algo sobre nosotros..."
      />
      <Button variant="outline" className='w-full'  onClick={handleSubmit}> Guardar</Button>
      {/* <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Guardar
      </button> */}
      {submittedContent && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Contenido actual:</h2>
          <p className="mt-2 p-4 border border-gray-300 rounded bg-gray-100">
            {submittedContent}
          </p>
        </div>
      )}
    </div>
  );
};

export default AboutSection;
