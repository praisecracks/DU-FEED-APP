import "./Admin.css"
import './AdminForm.css'
import { useState } from "react" 
// import contactImg from '../Images/contact image.svg'
import cont from '../../Asset/Book study.jpg'
import fb from '../../Asset/facebook.svg'
import googleImage  from '../../Asset/google img.png'
// import back from '../../Asset/arrow_back.svg'
// import logo from '../../Asset/logo.png'
import emailImage from '../../Asset/email.svg'
import passwordHidden from '../../Asset/lock.svg'


function AdminForm() {
 const [signState, setSignState] = useState("Welcome back")


  return (
    <div>
      <div className="adminForm">
        <div className="form-container">
          <div className="form-image">
            <div className="form-img">
              {/* <div className="bth">
                <button><img src= {back} alt="" /> <p></p></button>
                <img className="logo" src= {logo} alt="" />

                </div> */}
 <div className="contRealImage">
              <img src= {cont} alt="" />
                </div>
                {signState === "Create an account" ? 

              <div className="inner-t">
              <h2>Create Your Account</h2>
              <p>Join us and get started with DU FEEDS. Signing up is quick, and you’ll be able to access all our amazing features.</p>
                </div>:
              <div className="inner-t">
                <h2>Welcome Back to DU FEEDS!</h2>
                <p>We have missed you! Please log in to continue exploring and managing your account. If you dont have an account yet, feel free to sign up and join our community!</p>
                <div className="intro-btn">
                <button>Go back</button>
                </div>
                  </div>
                }
            </div>
          </div>

          <div className="form-field">
            <div className="form-title">
            <h1>{signState}</h1>

            {signState === 'Create an account' ? 
             <p>Not an Admin? Sign in as a <a href="http://localhost:5173/Login">Student</a></p>:
             <p>Not an Admin? Sign Up as a <a href="http://localhost:5173/Login">Student</a></p>
             }

            {signState === "Create an account"?
            <p>Already have an account <a  onClick={() =>{setSignState("Welcome back")}}>Sign in</a></p>:
            <p>Dont have account <a onClick={() =>{setSignState("Create an account")}}>Sign Up</a></p>
          }
            

              {signState === "Create an account" ? 
            <div className="sign-with">
            <div className="github"> <img src= {googleImage} alt="" /> Google</div>
           <div className="github"><img src= {fb} alt="" /> Facebook</div>
           </div>:
            <div className="sign-with">
            <div className="github"> <img src= {googleImage} alt="" /> Google</div>
            <div className="github"><img src= {fb} alt="" /> Facebook</div>
            </div>
    
              }

            <div className="inputs">

              {signState === "Create an account" ?
              <div className="input">
              <label htmlFor="name">Lecturer Name :</label><br />
              <input type="text" name="name" id="name" />
              </div>:
              <></>
            }

            <div className="input">     
              <label htmlFor="email">Email :</label><br />
              <input type="email" name="email" id="email" />
            <img src= {emailImage} alt="" />
                </div>

              <div className="input">
              <label htmlFor="password">Password :</label><br />
              <input type="password" name="password" id="password" />
              <img src= {passwordHidden} alt="" /> <br />
              {signState === "Create an account" ? 
              <></>:
              <span className="forget">Dont remember your password? <a href="">Forget Password</a></span>
              }
            </div>


                {signState === "Create an account" ? 
                <p className="appreciation">Hello Visitor, Thank for visting </p>:
                <p className="appreciation">Hello Friend, Thank for visting </p>
                }
                {signState === "Create an account" ?
                <button type="submit" onClick={() =>{setSignState("Welcome back")}}>Sign up</button>:
                <button type="button">Sign In</button>
                }
            </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminForm