import './About.css'
import Mission from './Mission'
import Carrier from './Carrier'
import Team from './Team'
import Header from '../../Containers/Header/Header'
import Footer from '../../Containers/Footer/Footer'

function About() {
  return (
    <div>
      <Header />
        <Mission/>
        <Carrier />
        <Team />
        <Footer />
    </div>
  )
}

export default About