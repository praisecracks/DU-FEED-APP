import './Footer.css'

import send from '../../Asset/upload.svg'
import facebook from '../../Asset/instagram.png'
import google from '../../Asset/google img.png'

function Footer() {
  const handlClick = () => {
    alert("Working on it...");
  };

  return (
    <footer className="footer bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 px-6 md:px-20">
      <div className="footer-container max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* ABOUT */}
          <div>
            <h3 className="text-lg font-bold mb-4">ABOUT US</h3>
            <ul className="space-y-2 text-sm text-indigo-300">
              <li><a href="#mission">Our Mission</a></li>
              <li><a href="#carrier">Careers</a></li>
              <li><a href="#team">Our Team</a></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-300">CONTACT US</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>info@du-feeds.com</li>
              <li>+2 223 555 3488</li>
              <li>Ibadan, Lagos Expressway, Onigarri, Nigeria</li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-300" >SOCIAL</h3>
            <div className="flex items-center gap-4">
                <a href="https://dominionuniversityibadan.edu.ng/">
              <img src={google} alt="Google" className="w-8 h-8 hover:scale-110 transition" />
                </a>
                <a href="https://www.instagram.com/dominionuniversityibadan/?hl=en">
              <img src={facebook} alt="Facebook" className="w-8 h-8 hover:scale-110 transition" />
                </a>
            </div>
          </div>
        </div>

        {/* SUBSCRIBE */}
        <div className="subscribe mb-12">
          <h4 className="text-xl font-semibold mb-4 text-gray-300">SUBSCRIBE TO OUR NEWSLETTER</h4>
          <div className="flex items-center gap-2 max-w-md">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 rounded-md text-black outline-none"
            />
            <button onClick={handlClick} className="bg-blue-600 p-3 rounded-md hover:bg-blue-700 transition">
              <img src={send} alt="Send" className="w-5 h-5" />
            </button>
          </div>
        </div>

      
        <div className="text-center text-sm border-t border-gray-600 pt-6 text-gray-500">
          © 2025 DU FEEDS. All rights reserved. Powered by Dominion University Student — <span className="font-semibold">PraiseCrack</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
