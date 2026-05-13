import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const baseUrl = process.env.REACT_APP_BASE_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      customerId: "999999999",
      email,
      password,
    };

    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/admin/user-master/login`,
        payload
      );

      console.log("response: ", response);

      if (response.data.data) {
        const { accessToken, refreshToken, user } = response.data.data;

        localStorage.setItem("authToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        setLoading(false);
        setError("");
        navigate("/home");
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-4">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <FaUserAlt className="absolute top-3 left-3 text-gray-500" />
            <input
              type="email"
              placeholder="Email"
              className="pl-10 w-full py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-500" />
            <input
              type={showPassword ? "text" : "password"} // Toggle input type
              placeholder="Password"
              className="pl-10 pr-10 w-full py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)} // Toggle visibility
              className="absolute top-3 right-3 text-gray-500 focus:outline-none"
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-opacity-90 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
