import { useState } from "react";
import { loginUser, forgotPassword, resetPassword } from "../../Api/api";
import { useNavigate } from "react-router-dom";
import { CommonToaster } from "../../Common/CommonToaster";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiKey } from "react-icons/fi";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function Login() {
  const [view, setView] = useState("login"); // 'login', 'forgot', 'reset'
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [resetData, setResetData] = useState({ email: "", otp: "", newPassword: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();

  // Handle Login Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  // Handle Reset Input Change
  const handleResetChange = (e) => {
    const { name, value } = e.target;
    setResetData({ ...resetData, [name]: value });
  };

  // Validate Login Form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.identifier) {
      newErrors.identifier = "Email or Employee ID is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const isEmail = /\S+@\S+\.\S+/.test(formData.identifier);
      const loginPayload = {
        password: formData.password,
        ...(isEmail
          ? { email: formData.identifier }
          : { employeeId: formData.identifier }),
      };

      const response = await loginUser(loginPayload);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      CommonToaster("Login successful!", "success");
      navigate("/admin/dashboard");
    } catch (error) {
      setErrors({
        submit: error.response?.data?.error || "Login failed. Check your credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Forgot Password (Send OTP)
  // Submit Forgot Password (Send OTP)
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!resetData.email) {
      CommonToaster("Please enter your email", "error");
      return;
    }
    setIsLoading(true);
    try {
      await forgotPassword({ email: resetData.email });

      // ⭐ THE FIX ⭐
      setResetData({ ...resetData, email: resetData.email });

      CommonToaster("OTP sent to your email", "success");
      setView("reset");
    } catch (error) {
      CommonToaster(error.response?.data?.error || "Failed to send OTP", "error");
    } finally {
      setIsLoading(false);
    }
  };


  // Submit Reset Password
  const handleResetSubmit = async (e) => {
    e.preventDefault();

    // Validate all required fields
    if (!resetData.email) {
      CommonToaster("Email is missing. Please start over from Forgot Password.", "error");
      setView("forgot");
      return;
    }

    if (!resetData.otp || !resetData.newPassword) {
      CommonToaster("Please fill all fields", "error");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Submitting reset password with:", {
        email: resetData.email,
        otp: resetData.otp,
        passwordLength: resetData.newPassword.length
      });

      await resetPassword({
        email: resetData.email,
        otp: resetData.otp,
        newPassword: resetData.newPassword,
      });

      CommonToaster("Password reset successful! Please login.", "success");
      setView("login");
      setResetData({ email: "", otp: "", newPassword: "" });
    } catch (error) {
      console.error("Reset password error:", error.response?.data);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || "Failed to reset password";

      if (errorMsg.toLowerCase().includes("expired") || errorMsg.toLowerCase().includes("invalid")) {
        CommonToaster("OTP has expired or is invalid. Please request a new one.", "error");
        setView("forgot");
      } else {
        CommonToaster(errorMsg, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-black px-4 pt-30">
        <div className="w-full max-w-[550px] bg-[#111] border border-[#222] rounded-2xl p-8 shadow-2xl relative overflow-hidden">


          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src="/logo/logo.png" alt="Cotco Logo" className="h-12 object-contain" />
          </div>

          {/* LOGIN VIEW */}
          {view === "login" && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Login</h2>
                <p className="text-gray-400 text-sm capitalize">
                  Enter your Email Address or Employee Code below to login to your account
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 tracking-wider">
                    Email Address or Employee Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="identifier"
                      value={formData.identifier}
                      onChange={handleChange}
                      placeholder="Enter your Email Address"
                      className="w-full bg-[#1A1A1A] !text-white pl-4 pr-4 py-3 rounded-lg border border-[#333] focus:border-[#0088CC] focus:ring-1 focus:ring-[#0088CC] outline-none transition-all placeholder:text-gray-600 text-sm"
                    />
                  </div>
                  {errors.identifier && <p className="text-xs text-red-500 mt-1">{errors.identifier}</p>}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-medium text-gray-400 tracking-wider">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your Password"
                      className="w-full bg-[#1A1A1A] !text-white pl-4 pr-10 py-3 rounded-lg border border-[#333] focus:border-[#0088CC] focus:ring-1 focus:ring-[#0088CC] outline-none transition-all placeholder:text-gray-600 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 !text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>

                {errors.submit && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg text-center">
                    {errors.submit}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#0088CC] hover:bg-[#0077B5] !text-white rounded-lg font-semibold transition-all shadow-lg shadow-[#0088CC]/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>

                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => setView("forgot")}
                    className="!text-gray-500 hover:text-[#0088CC] text-sm transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
            </>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {view === "forgot" && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
                <p className="text-gray-400 text-sm">
                  Enter your email address to receive an OTP
                </p>
              </div>

              <form onSubmit={handleForgotSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5  tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-3.5 text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      value={resetData.email}
                      onChange={handleResetChange}
                      placeholder="Enter your email"
                      className="w-full bg-[#1A1A1A] !text-white pl-10 pr-4 py-3 rounded-lg border border-[#333] focus:border-[#0088CC] focus:ring-1 focus:ring-[#0088CC] outline-none transition-all placeholder:text-gray-600 text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#0088CC] hover:bg-[#0077B5] !text-white rounded-lg font-semibold transition-all shadow-lg shadow-[#0088CC]/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </button>

                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => setView("login")}
                    className="flex items-center justify-center gap-2 !text-gray-500 hover:text-white text-sm transition-colors mx-auto"
                  >
                    <FiArrowLeft /> Back to Login
                  </button>
                </div>
              </form>
            </>
          )}

          {/* RESET PASSWORD VIEW */}
          {view === "reset" && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">New Password</h2>
                <p className="text-gray-400 text-sm">
                  Enter the OTP sent to your email and your new password
                </p>
              </div>

              <form onSubmit={handleResetSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5  tracking-wider">
                    OTP Code
                  </label>
                  <div className="relative">
                    <FiKey className="absolute left-3 top-3.5 text-gray-500" />
                    <input
                      type="text"
                      name="otp"
                      value={resetData.otp}
                      onChange={handleResetChange}
                      placeholder="Enter OTP"
                      className="w-full bg-[#1A1A1A] !text-white pl-10 pr-4 py-3 rounded-lg border border-[#333] focus:border-[#0088CC] focus:ring-1 focus:ring-[#0088CC] outline-none transition-all placeholder:text-gray-600 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5  tracking-wider">
                    New Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-3.5 text-gray-500" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={resetData.newPassword}
                      onChange={handleResetChange}
                      placeholder="Enter new password"
                      className="w-full bg-[#1A1A1A] !text-white pl-10 pr-10 py-3 rounded-lg border border-[#333] focus:border-[#0088CC] focus:ring-1 focus:ring-[#0088CC] outline-none transition-all placeholder:text-gray-600 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3 !text-gray-500 hover:text-gray-300"
                    >
                      {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#0088CC] hover:bg-[#0077B5] !text-white rounded-lg font-semibold transition-all shadow-lg shadow-[#0088CC]/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>

                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => setView("login")}
                    className="flex items-center justify-center gap-2 !text-gray-500 hover:text-white text-sm transition-colors mx-auto"
                  >
                    <FiArrowLeft /> Back to Login
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
