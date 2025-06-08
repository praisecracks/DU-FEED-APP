import './About.css'

// import { Link, NavLink } from "react-router-dom"


function Mission() {
  return (
    <div id='mission' className="bg-gray-100 py-20 px-6 md:px-28 text-gray-800">
      {/* Header Section */}
      <div className="text-center mb-16 mt-10" >
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          <span className="text-blue-700">DU</span><span className="text-gray-900">FEED</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Bridging communication across Dominion University through reliable reporting and engagement.
        </p>
      </div>

      {/* Mission, Vision, and Values */}
      <div className="grid md:grid-cols-3 gap-12">
        {/* Mission */}
        <div className="bg-white rounded-xl shadow-md p-8 transition hover:shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed text-[16.5px]">
            Empowering students and staff with a platform to share, discover, and stay informed on
            important news and events. We foster transparency, communication, and meaningful community engagement.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-white rounded-xl shadow-md p-8 transition hover:shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Our Vision</h2>
          <p className="text-gray-700 leading-relaxed text-[16.5px]">
            To create a vibrant, digital-first campus where every voice is valued, every event is accessible,
            and every story is told with integrity. DUFEED is your real-time gateway to campus life.
          </p>
        </div>

        {/* Values */}
        <div className="bg-white rounded-xl shadow-md p-8 transition hover:shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Our Core Values</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2 text-[16.5px]">
            <li>Transparency</li>
            <li>Credibility</li>
            <li>Student Engagement</li>
            <li>Integrity in Reporting</li>
            <li>Digital Innovation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Mission;
