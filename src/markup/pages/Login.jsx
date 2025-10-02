import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { ClipLoader } from "react-spinners";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import EmailIcon from '@mui/icons-material/Email';
import HttpsIcon from '@mui/icons-material/Https';
import loginService from "../../services/login.service";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const skipSplash = searchParams.get('skipSplash') === 'true';

  const [showSplash, setShowSplash] = useState(!skipSplash);

  // ✅ Clean URL if skipSplash is true (remove ?skipSplash=true)
  useEffect(() => {
    if (skipSplash) {
      navigate('/', { replace: true }); // Clean URL immediately
    }
  }, [skipSplash, navigate]);

  // ✅ Show splash screen logic
  useEffect(() => {
    if (!skipSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [skipSplash]);

  return (
    <div className="h-screen w-screen">
      {showSplash ? <SplashScreen /> : <LoginPage />}
    </div>
  );
}

// 🌌 Splash Screen Component
function SplashScreen() {
  return (
    <div className="relative h-screen w-screen flex items-center justify-center bg-gradient-to-b from-black to-blue-900 overflow-hidden">
      <div className="absolute inset-0 stars"></div>
      <h1 className="text-4xl md:text-6xl font-bold text-white animate-pulse z-10">
        ✨ Hive ✨
      </h1>
    </div>
  );
}

// 🔑 Login Page Component
function LoginPage() {
  const navigate = useNavigate(); // ✅ Must be inside LoginPage
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ Prevent native form submission
    setEmailError('');
    setPasswordError('');
    setServerError('');

    let valid = true;

    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        setEmailError('Invalid email format');
        valid = false;
      }
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }

    if (!valid) return;

    const formData = { email, password };

    try {
      setProcessing(true);

      const response = await loginService.logIn(formData);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setServerError(errorData.message || `Login failed: ${response.status}`);
        setProcessing(false);
        return;
      }

      const data = await response.json();
      console.log('✅ Login API response:', data);

   if (data.status === 'success' && data.data?.user_token) {
    console.log('🎉 Login SUCCESS - clearing error');
    setServerError('');
    
    const token = data.data.user_token;
    const decoded = JSON.parse(atob(token.split('.')[1]));

    const userInfo = {
        user_token: token,
        id: decoded.id,
        first_name: decoded.first_name,
        last_name: decoded.last_name,
        email: decoded.email
    };

    localStorage.setItem("user", JSON.stringify(userInfo));
    
    console.log('🚀 About to navigate to /dashboard');
    navigate('/dashboard', { replace: true });
    console.log('✅ Navigation triggered');
} else {
    console.log('❌ Login FAILED - showing error:', data.message);
    setServerError(data.message || "Login failed");
}
    } catch (error) {
      console.error('Login error:', error);
      setServerError("An error occurred: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white overflow-hidden">
      <div className="w-full max-w-md p-5 rounded-lg bg-black border border-blue-500 shadow-lg min-h-[300px] flex flex-col items-center">
        <h1 className="mb-5 text-2xl font-bold">Log In</h1>
        <form 
          onSubmit={handleSubmit} 
          className="w-full flex flex-col items-center"
          action="#" 
          method="post" // ✅ Prevents browser fallback to GET
        >
          {/* Email Field */}
          <div className="w-full mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <EmailIcon style={{ color: "#90caf9" }} />
              </div>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full pl-10 pr-4 py-3 bg-gray-200 text-black rounded focus:bg-white focus:outline-none text-sm"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="w-full mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <HttpsIcon style={{ color: "#90caf9" }} />
              </div>
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>

          {/* Forgot Password */}
         

          {emailError && <div className="text-red-400 text-sm mt-2 text-center">{emailError}</div>}
          {passwordError && <div className="text-red-400 text-sm mt-2 text-center">{passwordError}</div>}
          {serverError && <div className="text-red-400 text-sm mt-2 text-center">{serverError}</div>}

          {/* Login Button */}
          <button
            type="submit"
            disabled={processing}
            className={`w-full py-3 mb-4 rounded font-medium transition-colors flex items-center justify-center ${
              processing
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {processing ? (
              <>
                <ClipLoader color="#fff" size={12} />
                <span className="ml-2 text-sm">Logging in...</span>
              </>
            ) : (
              "Log In"
            )}
          </button>

          {/* Divider */}
          <div className="w-full my-4 flex items-center">
            <div className="flex-grow border-t border-gray-500"></div>
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-500"></div>
          </div>

          {/* Google Sign-In Button */}
          {/* <button
            type="button"
            disabled={processing}
            className={`w-full py-3 mb-4 rounded font-medium transition-colors flex items-center justify-center ${
              processing
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {processing ? (
              <>
                <ClipLoader color="#fff" size={12} />
                <span className="ml-2 text-sm">Signing in...</span>
              </>
            ) : (
              <>
                <FcGoogle className="text-xl mr-2" />
                <span>Continue with Google</span>
              </>
            )}
          </button> */}

          {/* Sign Up Link */}
          <div className="text-sm text-center">
            Don't have an account?{" "}
            <Link
              to="/signup"
              state={{ role: "startup" }}
              className="text-blue-400 hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}