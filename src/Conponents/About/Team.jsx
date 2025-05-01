import './About.css'
import image from '../../Asset/Book study.jpg'

function Team() {
  return (
    <div>
      <div className="team">
        <div className="team-heading">
          <h2 style={{color: "#fff"}}>Meet the Team</h2>
          <p style={{color: "#fff"}}>
            Behind every update, event post, and piece of breaking news on DUFEED 
            is a dedicated team of developers, content managers, and moderators. 
            Together, we ensure the platform runs smoothly and serves the Dominion University community with excellence.
          </p>
        </div>
      </div>

      <div className="image-container">
        <div className="listed-host">

          <div className="hostOne">
            <img src={image} alt="General Manager" />
            <h3>Project Lead</h3>
            <span>Miss Ayediran</span>
          </div>

          <div className="hostOne">
            <img src={image} alt="Senior Manager" />
            <h3>Frontend Developer</h3>
            <span>Praise Crack</span>
          </div>

          <div className="hostOne">
            <img src={image} alt="Assistant Manager" />
            <h3>Content & QA Manager</h3>
            <span>Jessica Grace</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Team
