import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Verify = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-12">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] right-[25%] w-[35%] h-[35%] rounded-full bg-green-50/50 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[15%] left-[25%] w-[35%] h-[35%] rounded-full bg-blue-50/50 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Card className="w-full max-w-md z-10 border-none shadow-2xl shadow-slate-200/50 rounded-2xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-4 text-center pt-10">
          <div className="flex justify-center">
            <div className="relative">
              <div className="p-4 bg-green-50 rounded-2xl relative z-10">
                <Mail className="w-10 h-10 text-green-600" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center z-20">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Check Your Email</CardTitle>
            <CardDescription className="text-slate-500 text-base max-w-[280px] mx-auto">
              We've sent a verification link to your inbox. Please follow the instructions to secure your account.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-10 pt-4 flex flex-col gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-2">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2 text-center">Next Steps</p>
            <ul className="text-sm text-slate-600 space-y-2">
              <li className="flex gap-2 items-start">
                <span className="bg-green-100 text-green-700 w-5 h-5 flex items-center justify-center rounded-full text-[10px] shrink-0 mt-0.5">1</span>
                <span>Open your email client</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="bg-green-100 text-green-700 w-5 h-5 flex items-center justify-center rounded-full text-[10px] shrink-0 mt-0.5">2</span>
                <span>Click the verification button</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="bg-green-100 text-green-700 w-5 h-5 flex items-center justify-center rounded-full text-[10px] shrink-0 mt-0.5">3</span>
                <span>Wait to be redirected back to the store</span>
              </li>
            </ul>
          </div>

          <button 
            onClick={() => window.open('https://mail.google.com', '_blank')}
            className="w-full h-12 flex items-center justify-center gap-2 text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all shadow-lg shadow-slate-200"
          >
            Go to Gmail <ExternalLink size={14} />
          </button>
          
          <div className="text-center mt-2">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <p className="mt-8 text-slate-400 text-sm z-10">
        Didn't receive code? <button className="text-blue-600 font-medium hover:underline">Resend email</button>
      </p>
    </div>
  );
};

export default Verify;

