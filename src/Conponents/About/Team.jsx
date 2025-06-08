import image from '../../Asset/Book study.jpg';

function Team() {
  return (
    <div className="bg-gray-100 py-20 px-6 md:px-28">
      {/* Header */}
      <div id='team' className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">Meet the Team</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Behind every update, event post, and breaking news on DUFEED is a passionate team of
          developers, content managers, and moderators. Together, we serve the Dominion University
          community with dedication and excellence.
        </p>
      </div>

      {/* Team Grid */}
      <div className="grid gap-12 md:grid-cols-3 text-center">
        {[
          {
            title: 'Project Lead',
            name: 'Miss Ayediran',
            image: image,
          },
          {
            title: 'Frontend Developer',
            name: 'Praise Crack',
            image: image,
          },
          {
            title: 'Content & QA Manager',
            name: 'Jessica Grace',
            image: image,
          },
        ].map((member, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-6 transition hover:shadow-xl"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-4 border-blue-100"
            />
            <h3 className="text-xl font-semibold text-blue-700">{member.title}</h3>
            <p className="text-gray-800">{member.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Team;
