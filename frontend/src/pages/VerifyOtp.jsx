import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";

const VerifyOtp = () => {
  const { email } = useParams();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `http://localhost:3001/auth/verify-otp/${email}`,
        { otp : otp.trim() }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate(`/change-password/${email}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-12">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[35%] h-[35%] rounded-full bg-blue-100/40 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[20%] left-[10%] w-[35%] h-[35%] rounded-full bg-indigo-100/40 blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <Card className="w-full max-w-md z-10 border-none shadow-2xl shadow-slate-200/50 rounded-2xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center pt-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <ShieldCheck className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Verify OTP</CardTitle>
          <CardDescription className="text-slate-500 text-sm">
            We've sent a 6-digit code to <span className="font-semibold text-slate-700">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={submitHandler} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-slate-700 font-medium ml-1">One-Time Password</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="h-14 text-center text-2xl tracking-[0.5em] font-bold border-slate-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                </span>
              ) : (
                "Verify Code"
              )}
            </Button>

            <div className="text-center pt-2">
              <p className="text-sm text-slate-500 mb-4">
                Didn't receive the code? {" "}
                <button type="button" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                  Resend
                </button>
              </p>
              <Link 
                to="/forgot-password" 
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Forgot Password
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

export default VerifyOtp;

