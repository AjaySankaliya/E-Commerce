import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

const ChangePassword = () => {
  const { email } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

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
      toast.error(error.response?.data?.message || "Error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-200">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler} className="flex flex-col gap-4">
            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                name="newPassword"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                name="confirmNewPassword"
                required
                onChange={handleChange}
              />
            </div>
            <Button type="submit">Update Password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePassword;
