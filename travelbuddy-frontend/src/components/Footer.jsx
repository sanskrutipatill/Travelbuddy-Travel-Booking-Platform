const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Travel<span className="text-indigo-600">Buddy</span>
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Your ultimate travel companion for flights, hotels, trains, and cabs.
            Book with ease and travel with confidence.
          </p>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-gray-900 font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li className="hover:text-indigo-600 cursor-pointer">About Us</li>
            <li className="hover:text-indigo-600 cursor-pointer">Careers</li>
            <li className="hover:text-indigo-600 cursor-pointer">Blog</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-gray-900 font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li className="hover:text-indigo-600 cursor-pointer">Help Center</li>
            <li className="hover:text-indigo-600 cursor-pointer">FAQs</li>
            <li className="hover:text-indigo-600 cursor-pointer">Privacy Policy</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-gray-900 font-semibold mb-4">Contact</h3>
          <div className="space-y-2 text-gray-600 text-sm">
            <p>📍 Chhattrapati Sambhaji Nagar</p>
            <p>📞 7020834329 / 9860711194</p>
            <p>✉ sanskrutip0205@gmail.com</p>
            <p>✉ atharvakakde40@gmail.com</p>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-gray-200 mt-10 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} TravelBuddy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
