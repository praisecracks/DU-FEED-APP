import './Error.css'
import back from '../Images/arrow_back.svg'
import logo from '../Images/logo.png'
import { useState } from 'react'


function Error() {

  const [details, setDetailState] = useState("Show details")

  return (
    <div className='error-page'>
      <div className="nav">
        <img src= {back} alt="" />
      </div>
      <div className="mid-logo">
        <img src= {logo} alt="" />
      </div>
      <div className="content">
        <h3>Lorem ipsum dolor sit amet consectetur.</h3>
        {details === "Show details" ? 
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque laborum commodi aperiam! Impedit fugit vitae quis, natus magni sint quidem dolorum obcaecati ad tempore asperiores nemo enim. Nisi, dolore eligendi.</p>:
         <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores in deleniti, quo debitis nisi rem similique quaerat ab earum sapiente, fuga cum, corrupti dolores nihil aspernatur velit veritatis ipsa pariatur libero delectus. Amet expedita cum suscipit, nihil repellat non repellendus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, rem!</p>
        }
      </div>
      <div className="error-btns">
      <button type="button"><a href="http://localhost:5173/Error">Reload</a></button>
        <button  onClick={() =>{setDetailState("Showed")}} type="button">{details}</button>
      </div>
    </div>
  )
}

export default Error