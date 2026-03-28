import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("Verifying your email address...");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.post(
          "http://localhost:3001/auth/verify",
          {},
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (res.data.success) {
          setStatus("success");
          setMessage("✅ Email verified successfully!");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "❌ Verification failed. The link may have expired."
        );
      }
    };
    if (token) verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-12 text-center">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[20%] left-[20%] w-[35%] h-[35%] rounded-full blur-3xl animate-pulse transition-colors duration-1000 ${
          status === 'verifying' ? 'bg-blue-100/50' : status === 'success' ? 'bg-green-100/50' : 'bg-red-100/50'
        }`}></div>
      </div>

      <Card className="w-full max-w-md z-10 border-none shadow-2xl shadow-slate-200/50 rounded-2xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-4 pt-10">
          <div className="flex justify-center">
            {status === "verifying" && (
              <div className="p-4 bg-blue-50 rounded-2xl">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              </div>
            )}
            {status === "success" && (
              <div className="p-4 bg-green-50 rounded-2xl">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
            )}
            {status === "error" && (
              <div className="p-4 bg-red-50 rounded-2xl">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
              {status === "verifying" ? "Verifying Email" : status === "success" ? "All Set!" : "Verification Failed"}
            </CardTitle>
            <CardDescription className="text-slate-500 text-base max-w-[280px] mx-auto">
              {message}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-10 pt-4">
          {status === "success" && (
            <p className="text-sm text-slate-400">
              Redirecting you to login in a few seconds...
            </p>
          )}
          {status === "error" && (
            <button 
              onClick={() => navigate('/login')}
              className="px-8 h-12 text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all shadow-lg"
            >
              Back to Login
            </button>
          )}
        </CardContent>
      </Card>
      
      <p className="mt-8 text-slate-400 text-sm z-10">
        Need help? <a href="#" className="text-blue-600 font-medium hover:underline">Contact Support</a>
      </p>
    </div>
  );
};

export default VerifyEmail;

