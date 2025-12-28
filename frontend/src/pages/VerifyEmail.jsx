import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("Verifying...");
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
          setStatus("✅ Email verified successfully!");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } catch (error) {
        setStatus(
          error.response?.data?.message ||
            "❌ Verification failed. Please try again."
        );
        console.log(error);
      }
    };
    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="relative w-full h-190 bg-blue-200 overflow-hidden">
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-2xl shadow-md text-center w-[90%] max-w-md">
          <h2 className="text-xl font-semibold text-gray-800">{status}</h2>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
