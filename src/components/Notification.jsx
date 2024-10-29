const Notification = ({ successMessage, errorMessage }) => {
  return (
    <>
      {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
    </>
  );
};

export default Notification;
