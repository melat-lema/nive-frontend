import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff, PersonOutline } from "@mui/icons-material";
import EmailIcon from '@mui/icons-material/Email';
import HttpsIcon from '@mui/icons-material/Https';
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import signinService from "../../services/signin.service";

function SignUp() {
  
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [processing, setProcessing] = useState(false);
 const [email, setEmail]=useState("");
 const [first_name, setFirstName]=useState("");
 const [last_name, setLastName]=useState("");
 const [password_hash, setPassword]=useState("");
  const [termsChecked, setTermsChecked] = useState(false);

   const [emailError, setEmailError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');
 

  const handleCheckboxChange = () => {
    setTermsChecked(!termsChecked);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  
  const handleSubmit=async(e)=>{
    e.preventDefault();
    setEmailError('');
    setFirstNameError('');
    setLastNameError('');
    setPasswordError('');
    setSuccess('');
    setServerError('');

    let valid=true;

    if(!email){
      setEmailError('Email is required');
      valid=false;
    }
    else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        setEmailError('Invalid email format');
        valid = false;
      }
    }
    if(!first_name){
      setFirstNameError("First Name is required")
      valid=false
    }
    if (!last_name) {
      setLastNameError('Last name is required');
      valid = false;
    }

    if (!password_hash) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password_hash.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }

    if (!valid) return;

    const userData={
      email,
      first_name,
      last_name,
      password_hash,
    };
   signinService.signinUser(userData)
  .then((data) => {
    console.log('✅ API Response:', data); // 👈 ADD THIS
    if (data.error) {
      setServerError(data.error);
    } else {
      setSuccess("User Registered");
      setTimeout(() => {
        navigate('/?skipSplash=true');
      }, 2000);
    }
  })
  .catch((error) => {
    console.error('❌ API Error:', error); // 👈 ADD THIS
    setServerError(error.message);
  });
    
  }
 

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white overflow-hidden p-4">
      <div className="w-full max-w-md p-6 rounded-lg bg-black border border-blue-600 shadow-lg min-h-[300px] flex flex-col items-center"
           style={{ boxShadow: "0 4px 8px 2px rgba(52, 6, 167, 0.5)" }}>
        <h1 className="mb-6 text-2xl font-bold">Sign In</h1>
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">

          {/* First Name */}
          <div className="w-full mb-4 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <PersonOutline style={{ color: "#90caf9" }} />
            </div>
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              value={first_name}
              onChange={(e)=> setFirstName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-200 text-black rounded focus:bg-white focus:outline-none text-sm"
              required
            />
          </div>

          {/* Last Name */}
          <div className="w-full mb-4 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <PersonOutline style={{ color: "#90caf9" }} />
            </div>
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={last_name}
              onChange={(e)=>setLastName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-200 text-black rounded focus:bg-white focus:outline-none text-sm"
              required
            />
          </div>

          {/* Email */}
          <div className="w-full mb-4 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <EmailIcon style={{ color: "#90caf9" }} />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-200 text-black rounded focus:bg-white focus:outline-none text-sm"
              required
            />
          </div>

          {/* Password */}
          <div className="w-full mb-4 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <HttpsIcon style={{ color: "#90caf9" }} />
            </div>
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={password_hash}
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-gray-200 text-black rounded focus:bg-white focus:outline-none text-sm"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-blue-300 focus:outline-none"
              >
                {passwordVisible ? (
                  <Visibility style={{ color: "#90caf9" }} />
                ) : (
                  <VisibilityOff style={{ color: "#90caf9" }} />
                )}
              </button>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="w-full mb-4 flex items-center">
            <input
              type="checkbox"
              checked={termsChecked}
              onChange={handleCheckboxChange}
              className="mr-2 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm">
              I agree to the{" "}
              <a
                href="/terms"
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline"
              >
                Terms & Policy
              </a>
            </span>
          </div>

          {/* Error Message */}
          {emailError && <div className="text-red-400 text-sm mt-2 text-center">{emailError}</div>}
          {firstNameError && <div className="text-red-400 text-sm mt-2 text-center">{firstNameError}</div>}
          {lastNameError && <div className="text-red-400 text-sm mt-2 text-center">{lastNameError}</div>}
          {passwordError && <div className="text-red-400 text-sm mt-2 text-center">{passwordError}</div>}
          {success && <div className="text-green-400 text-sm mt-2 text-center">{success}</div>}
          {serverError && <div className="text-red-400 text-sm mt-2 text-center">{serverError}</div>}
          {/* Submit Button */}
          <button
            type="submit"
            // disabled={!termsChecked || processing}
            className={`w-full py-3 mt-2 rounded font-medium transition-colors flex items-center justify-center ${
              processing 
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white text-sm`}
          >
            {processing ? (
              <>
                <ClipLoader color="#fff" size={12} />
                <span className="ml-2">Please wait...</span>
              </>
            ) : (
              "Create an account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="w-full my-6 flex items-center">
          <div className="flex-grow border-t border-gray-500"></div>
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-500"></div>
        </div>

        {/* Google Sign-In Button */}
        {/* <button
          type="button"
          // onClick={handleGoogleSignIn}
          disabled={processing}
          className={`w-full py-3 mb-4 rounded font-medium transition-colors flex items-center justify-center ${
            processing
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white text-sm`}
        >
          {processing ? (
            <>
              <ClipLoader color="#fff" size={12} />
              <span className="ml-2">Signing in...</span>
            </>
          ) : (
            <>
              <FcGoogle className="text-xl mr-2" />
              Sign in with Google
            </>
          )}
        </button> */}

        {/* Login Link */}
        <div className="mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/?skipSplash=true" className="text-blue-400 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;