import "./Login.css";
import { useState } from "react";
import cont from '../../Asset/Book study.jpg';
import emailImage from '../../Asset/email.svg';
import passwordHidden from '../../Asset/lock.svg';
import { auth, db } from "../../Context/Firebase";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import passwordShow from "../../Asset/eye.svg";

function Login() {
  const [signState, setSignState] = useState("Create an account");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [matricNo, setMatricNo] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = (e) => {
    e.stopPropagation();
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

const isValidMatric = (matric) => {
  const matricRegex = /^DU\d{4}$/i;
  return matricRegex.test(matric);
};


  const HandleSignUP = async () => {
    if (!isValidMatric(matricNo)) {
      toast.error("Invalid Matric Number. Use format: DU2101");
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, {
        displayName: name,
      });

      await setDoc(doc(db, "Users", result.user.uid), {
        uid: result.user.uid,
        email,
        name,
        matricNo,
        RegisteredTime: new Date().getTime(),
        isAdmin: false,
      });

      toast.success("Account Created Redirecting");
      navigate("/home");
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("Error creating account. Try again.");
    }
  };

  const HandleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully. Redirecting...");
      navigate("/home");
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("Error logging in. Try again.");
    }
  };

  const HandleRecoverAccount = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Check email to proceed with account recovery");
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Error. Please try again.");
    }
  };

  return (
    <div>
      <div className="login">
        <div className="form-container">
          <div className="form-image">
            <div className="form-img">
              <div className="contRealImage">
                <img src={cont} alt="" />
              </div>

              {signState === "Create an account" ? (
                <div className="inner-t">
                  <h2>Create Your Account</h2>
                  <p>Join us and get started with DU FEEDS. Signing up is quick, and you’ll be able to access all our amazing features.</p>
                </div>
              ) : (
                <div className="inner-t">
                  <h2>Welcome Back to DU FEEDS!</h2>
                  <p>We have missed you! Please log in to continue exploring and managing your account. If you don’t have an account yet, feel free to sign up and join our community!</p>
                </div>
              )}
            </div>
          </div>

          <div className="form-field">
            <div className="form-title">
              <h1>{signState}</h1>

              {signState === "Recover Your Account" ? (
                <div className="inputs">
                  <div className="input">
                    <label htmlFor="email">Email:</label><br />
                    <input type="email" name="email" id="emailrecovery" onChange={(e) => setEmail(e.target.value)} placeholder="Enter Recover Email" required />
                    <p>Return Back to <a onClick={() => { setSignState("Welcome back!") }}>Sign in</a></p>                  </div>
                  <button type="submit" onClick={() => HandleRecoverAccount()}>Proceed</button>
                </div>
              ) : (
                <div className="inputs">
                  {signState === "Create an account" && (
                    <div className="input">
                      <label htmlFor="name">Username:</label><br />
                      <input type="text" name="name" id="name" onChange={(e) => setName(e.target.value)} placeholder="Student Name" required />
                    </div>
                  )}

                  {signState === "Create an account" && (
                    <div className="input">
                      <label htmlFor="matric">Matric No:</label><br />
                      <input
                        type="text"
                        name="matric"
                        id="matric"
                        onChange={(e) => setMatricNo(e.target.value)}
                        placeholder="Matric number in format DU/21/01"
                        required
                      />
                    </div>
                  )}

                  <div className="input">
                    <label htmlFor="email">Email:</label><br />
                    <input type="email" name="email" id="email" onChange={(e) => setEmail(e.target.value)} required placeholder="example@gmail.com" />
                    <img className="input-iconic" src={emailImage} alt="" />
                  </div>

                  <div className="input">
                    <label htmlFor="password">Password:</label><br />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="***must contain diff char for security***"
                      required
                      onChange={(e) => setPassword(e.target.value)}
                      id="password"
                    />
                    <img
                      className="input-iconic"
                      src={showPassword ? passwordShow : passwordHidden}
                      alt="Toggle Password Visibility"
                      onClick={togglePasswordVisibility}
                      style={{ cursor: "pointer" }}
                    />
                    {signState === "Create an account" ? null : (
                      // eslint-disable-next-line react/no-unescaped-entities
                      <span className="forget">Can't remember? <a onClick={() => { setSignState("Recover Your Account") }}>Forget Password</a></span>
                    )}
                  </div>

                  {signState === "Create an account" ? (
                    <p>Already have an account? <a onClick={() => { setSignState("Welcome back!") }}>Sign in</a></p>
                  ) : (
                    <p>Don’t have an account? <a onClick={() => { setSignState("Create an account") }}>Sign Up</a></p>
                  )}

                  {signState === "Create an account" ? (
                    <button type="submit" onClick={() => HandleSignUP()}>Sign up</button>
                  ) : (
                    <button type="submit" onClick={() => HandleSignIn()}>Sign in</button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
