import React, { useState } from "react";
import "./signup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../store";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Changed 'history' to 'navigate'
  const [Inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const change = (e) => {
    const { name, value } = e.target;
    setInputs({ ...Inputs, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:1000/api/v1/signin`, // Directly specifying the backend URL
        Inputs
      );
      console.log(response.data);
      if (response.data && response.data.user && response.data.user._id) {
        sessionStorage.setItem("id", response.data.user._id);
        dispatch(authActions.login());
        navigate("/todo"); // Changed 'history' to 'navigate'
      } else {
        // Handle the case where the response does not contain the expected data
        console.error("Response data or user._id not found in the response.");
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      // Handle any errors that occurred during the HTTP request
      console.error("An error occurred:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="signup">
      <div className="container">
        <div className="row">
          <div className="col-lg-5 column d-flex justify-content-center align-items-center ">
            
            <div className="d-flex flex-column w-100 p-3">
            <h1>Sign In</h1>
              <input
                className="p-2 my-3 input-signup"
                type="email"
                name="email"
                placeholder="Enter Your Email"
                value={Inputs.email}
                onChange={change}
              />
              <input
                className="p-2 my-3 input-signup"
                type="password"
                name="password"
                placeholder="Enter Your Password"
                value={Inputs.password}
                onChange={change}
              />
              <button className="btn-signup p-2" onClick={submit}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
