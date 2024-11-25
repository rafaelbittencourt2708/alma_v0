import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-auto">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Clinic Assistant. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="/privacy" className="hover:text-blue-300">Privacy Policy</a>
          <a href="/terms" className="hover:text-blue-300">Terms of Service</a>
          <a href="/contact" className="hover:text-blue-300">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
