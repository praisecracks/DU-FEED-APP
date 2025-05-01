import './About.css'
// import { Link, NavLink } from "react-router-dom"


function Mission() {
  return (
    <div className='Mission-body'>
    <div className="flow">
      <div className="mission">
        <div className="logo" style={{textAlign: "center", fontSize: "30px", marginBottom: "40px"}}>
          <b style={{fontFamily: "fantasy", letterSpacing: "2px", fontSize: "50px", paddingTop: "10px"}}>DU</b>FEED
        </div>
        <h1 style={{color: "#fff"}}>Our Mission</h1>
        <p style={{color: "#fff"}}>
          At DUFEED, our mission is to empower students and staff with a reliable platform 
          to share, discover, and stay updated on important news and events happening across 
          Dominion University. We aim to foster transparency, communication, and engagement within the academic community.
        </p>
      </div>
    </div>
  
    <div className="mid">
      <div className="load">
        <h2>Our Vision</h2>
        <p>
          We envision a vibrant digital space where every voice in the university is heard, 
          every story is told, and important events are easily accessible. 
          DUFEED strives to become the go-to platform for real-time campus reporting and information dissemination.
        </p>
      </div>
  
      <div className="values">
        <h2>Our Core Values</h2>
        <ul>
          <li>Transparency</li>
          <li>Credibility</li>
          <li>Student Engagement</li>
          <li>Integrity in Reporting</li>
          <li>Digital Innovation</li>
        </ul>
      </div>
    </div>
  </div>
  
  )
}

export default Mission