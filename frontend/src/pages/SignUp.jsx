import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Store } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "password") {
      const strength = value.length === 0 ? "" : value.length < 6 ? "Weak" : value.length < 10 ? "Medium" : "Strong";
      setPasswordStrength(strength);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/verify");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 bg-white">
      {/* Left Image/Graphic Section */}
      <div className="hidden lg:flex relative w-full h-full bg-slate-900 overflow-hidden order-2 lg:order-1">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-800 via-indigo-700 to-blue-600 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center w-full">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight max-w-lg">
            Start Your Journey.
          </h2>
          <p className="text-lg text-blue-100/90 max-w-md font-medium">
            Create an account to track your orders, save your wishlist, and enjoy a personalized shopping experience.
          </p>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 order-1 lg:order-2">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-600/30">
                <Store className="text-white w-6 h-6" />
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">Create your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Join us today! It only takes a minute.
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={submitHandler}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="h-12 border-gray-300 rounded-xl focus:ring-purple-600 focus:border-purple-600 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="h-12 border-gray-300 rounded-xl focus:ring-purple-600 focus:border-purple-600 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="h-12 border-gray-300 rounded-xl focus:ring-purple-600 focus:border-purple-600 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    placeholder="Create a strong password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="h-12 border-gray-300 rounded-xl focus:ring-purple-600 focus:border-purple-600 transition-all tracking-wide"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center max-h-12"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                {passwordStrength && (
                  <p className={`text-xs mt-1 font-medium ${passwordStrength === 'Weak' ? 'text-red-500' : passwordStrength === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`}>
                    Password Strength: {passwordStrength}
                  </p>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg shadow-purple-600/30 transition-all"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign up"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-500 transition-colors">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
