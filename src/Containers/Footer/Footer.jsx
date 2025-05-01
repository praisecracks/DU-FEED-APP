import './Footer.css'
import send from '../../Asset/upload.svg'
import facebook from '../../Asset/facebook.svg'
import google from '../../Asset/google img.png'

function Footer() {
  return (
    <div className='footer'>
        <div className="footer-container">
            <div className="foot-head">
                <div className="drop-one">
                <h3>ABOUT US</h3>
                <span>
                <a href="">Our Mission</a>
                <a href="">Carriers</a>
                <a href="">Our Team</a>
                </span>
                </div>
                <div className="drop-two">
                <h3>CONTACT US</h3>
                <div className="grid">
                <span>Info@DU-FEEDS.com</span>
                <span>+2 223 555 3488</span>
                <span>123 main St, Anthons, Nigeria</span>
                </div>
                </div>

                <div className="drop-three">
                <h3>SOCIAL</h3>
                <div className="reach-links">
                    <div className="one"><img src= {google} alt="" /></div>
                    <div className="one"><img src= {facebook} alt="" /></div>
                    <div className="one"><img src= {google} alt="" /></div>
                    <div className="one"><img src= {facebook} alt="" /></div>

                </div>

                </div>
            </div>
            <div className="info">
                <div className='srch'>
                    <h4>SUBSCRIBE NEWSLETTER</h4> <br />
                    <div className="ipt">
                <input type="search" name="search" id="search" /><label htmlFor=""><img src= {send} alt="" /></label>
                    </div>
                </div>
                {/* <span>https://dominionuniversity.com</span> */}
            </div>
            <div className="copyright">
                <p>
                    Copyright 2024 DU FEEDS. All right || reserved. Powered by Dominion University student || PraiseCrack
                </p>
            </div>
        </div>
    </div>
  )
}

export default Footer