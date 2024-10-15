const Footer = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-4">
        {/* Main footer content */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Left section: Address */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold mb-2">Tasca la Fundición</h3>
            <p className="text-sm">
              123 Restaurant Street, New York, NY 10001, United States
            </p>
            <p className="text-sm">Tel: (123) 456-7890</p>
            <p className="text-sm">Email: info@tascalafundicion.com</p>
          </div>
          {/* Center section: Social links */}
          <div className="flex space-x-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              <svg className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35C.595 0 0 .594 0 1.326v21.348C0 23.406.595 24 1.325 24h11.495v-9.294H9.671V10.71h3.149V8.322c0-3.11 1.898-4.802 4.674-4.802 1.328 0 2.469.099 2.8.143v3.243h-1.922c-1.505 0-1.796.714-1.796 1.763v2.312h3.59l-.467 3.996h-3.123V24h6.117C23.406 24 24 23.406 24 22.674V1.326C24 .595 23.406 0 22.675 0z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              <svg className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.353 3.608 1.328.975.975 1.266 2.242 1.328 3.608.059 1.266.07 1.646.07 4.851s-.012 3.584-.07 4.85c-.062 1.366-.353 2.633-1.328 3.608-.975.975-2.242 1.266-3.608 1.328-1.266.059-1.646.07-4.851.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.353-3.608-1.328-.975-.975-1.266-2.242-1.328-3.608-.059-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.851c.062-1.366.353-2.633 1.328-3.608.975-.975 2.242-1.266 3.608-1.328C8.416 2.175 8.796 2.163 12 2.163M12 0C8.741 0 8.333.014 7.052.072 5.72.13 4.51.422 3.494 1.438 2.478 2.454 2.186 3.665 2.128 4.996 2.07 6.276 2.056 6.684 2.056 12s.014 5.724.072 7.005c.058 1.331.35 2.542 1.366 3.558 1.016 1.016 2.227 1.308 3.558 1.366 1.281.058 1.689.072 7.005.072s5.724-.014 7.005-.072c1.331-.058 2.542-.35 3.558-1.366 1.016-1.016 1.308-2.227 1.366-3.558.058-1.281.072-1.689.072-7.005s-.014-5.724-.072-7.005c-.058-1.331-.35-2.542-1.366-3.558-1.016-1.016-2.227-1.308-3.558-1.366C16.724.014 16.316 0 12 0z" />
                <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.139c-2.193 0-3.976-1.783-3.976-3.976s1.783-3.976 3.976-3.976 3.976 1.783 3.976 3.976-1.783 3.976-3.976 3.976zm6.406-10.845c-.796 0-1.443.646-1.443 1.443s.646 1.443 1.443 1.443 1.443-.646 1.443-1.443-.646-1.443-1.443-1.443z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
