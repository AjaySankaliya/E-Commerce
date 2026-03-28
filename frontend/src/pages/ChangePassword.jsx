import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";

const ChangePassword = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmNewPassword) {
      return toast.error("Passwords do not match");
    }
    setLoading(true);

    try {
      const res = await axios.post(
        `http://localhost:3001/auth/change-password/${email}`,
        formData
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-12">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-blue-100/30 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[30%] rounded-full bg-indigo-100/30 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Card className="w-full max-w-md z-10 border-none shadow-2xl shadow-slate-200/50 rounded-2xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center pt-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Reset Password</CardTitle>
          <CardDescription className="text-slate-500 text-sm">
            Please enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={submitHandler} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-slate-700 font-medium ml-1">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="••••••••"
                  required
                  onChange={handleChange}
                  className="h-12 border-slate-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword" className="text-slate-700 font-medium ml-1">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmNewPassword"
                  type={showPassword ? "text" : "password"}
                  name="confirmNewPassword"
                  placeholder="••••••••"
                  required
                  onChange={handleChange}
                  className="h-12 border-slate-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 transition-all duration-200 mt-2"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                </span>
              ) : (
                "Update Password"
              )}
            </Button>

            <div className="text-center pt-2">
              <Link 
                to="/login" 
                className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <p className="mt-8 text-slate-400 text-sm z-10">
        © {new Date().getFullYear()} YourStore. All rights reserved.
      </p>
    </div>
  );
};

export default ChangePassword;

