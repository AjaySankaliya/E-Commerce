import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

const VerifyOtp = () => {
  const { email } = useParams();
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `http://localhost:3001/auth/verify-otp/${email}`,
        { otp }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate(`/change-password/${email}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-200">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Verify OTP</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler} className="flex flex-col gap-4">
            <div>
              <Label>OTP</Label>
              <Input
                type="text"
                placeholder="Enter 6-digit OTP"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <Button type="submit">Verify OTP</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOtp;
