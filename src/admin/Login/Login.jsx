import { useState } from "react";
import { loginUser } from "../../Api/api";
import { useNavigate } from "react-router-dom";
import { CommonToaster } from "../../Common/CommonToaster";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export default function Login() {
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.identifier) {
      newErrors.identifier = "Email or Employee ID is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Detect if the identifier is an email or employeeId
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
      navigate("/admin");
    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.error ||
          "Login failed. Check your credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side Form */}
      <div className="flex-1 flex items-center justify-center px-8 bg-white">
        <div className="w-full max-w-md">
          {/* Heading */}
          <h2 className="text-2xl font-bold mb-2">Sign In</h2>
          <p className="text-gray-500 mb-6">
            Enter your email address or employee ID to access the admin panel.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email or Employee ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email or Employee ID
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  placeholder="user@demo.com or EMP001"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 ${
                    errors.identifier
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
                />
              </div>
              {errors.identifier && (
                <p className="text-sm text-red-500 mt-1">{errors.identifier}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                <span style={{ color: "black" }}>Remember Me</span>
              </label>
            </div>

            {/* Error */}
            {errors.submit && (
              <div className="rounded-md bg-red-50 p-3 text-red-700 text-sm">
                {errors.submit}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-[#1276BD]/40 text-black rounded-lg hover:bg-orange-200 font-medium"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>

      {/* Right Side Image */}
      <div className="hidden lg:flex flex-1 h-[90%] bg-gray-100 items-center justify-center rounded-l-3xl">
        <img
          src="/img/about/contact.png"
          alt="Login Illustration"
          className="w-full object-cover rounded-l-3xl"
        />
      </div>
    </div>
  );
}
