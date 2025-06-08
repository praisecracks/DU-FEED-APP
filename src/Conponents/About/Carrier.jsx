import './About.css';

function Carrier() {
  return (
    <div id='carrier' className="bg-gradient-to-br from-blue-50 to-white py-20 px-6 md:px-28">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-6">Join Our Career Team</h1>
        
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          Are you passionate about news, events, or media? Join our campus team to make an impact! 
          As a contributor to the Dominion University News and Event Reporting System, 
          you’ll have the opportunity to grow your communication, journalism, and tech skills 
          while keeping the community informed.
        </p>

        <p className="text-gray-700 text-lg leading-relaxed">
          Roles are open for student reporters, editors, and content reviewers. 
          Earn recognition, build experience, and get involved in real-time campus stories. 
          Take the next step <span className="font-semibold text-blue-600">your voice matters here</span>.
        </p>
      </div>
    </div>
  );
}

export default Carrier;
