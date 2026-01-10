import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Package, Camera } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import userLogo from "../assets/userLogo.webp";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "@/redux/userSlice";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const userId = params.userId;
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const [updatedUser, setUpdatedUser] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    phoneNo: user?.phoneNo,
    address: user?.address,
    city: user?.city,
    zipCode: user?.zipCode,
    profilePic: user?.profilePic,
    profilePicPublicId: user?.profilePicPublicId,
  });

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUpdatedUser({
      ...updatedUser,
      profilePic: URL.createObjectURL(selectedFile),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(userId);
    console.log(updatedUser);
    console.log(file);

    const accessToken = localStorage.getItem("accessToken");

    try {
      const formData = new FormData();
      formData.append("firstName", updatedUser.firstName);
      formData.append("lastName", updatedUser.lastName);
      formData.append("email", updatedUser.email);
      formData.append("phoneNo", updatedUser.phoneNo);
      formData.append("address", updatedUser.address);
      formData.append("city", updatedUser.city);
      formData.append("zipCode", updatedUser.zipCode);

      if (file) {
        formData.append("profilePic", file);
      }

      const res = await axios.put(
        `http://localhost:3001/auth/updateProfile/${userId}`,
        formData,
        {
          headers: {
            Authorization: accessToken
          },
          withCredentials:true
        }
      );

      if (res.data.success) {
        toast.success("profile updated successfully");
        dispatch(setUser(res.data.user));
      }
    } catch (err) {
      console.log(err); 
      toast.error(
        err.response?.data?.message || err.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20">
      <Tabs defaultValue="profile" className="max-w-5xl mx-auto px-4">
        {/* Modern Segmented Tabs */}
        <TabsList className="flex w-fit mx-auto mb-10 bg-slate-200/50 p-1 rounded-xl">
          <TabsTrigger
            value="profile"
            className="flex items-center gap-2 px-8 py-2.5 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg transition-all font-semibold text-slate-600"
          >
            <User size={18} /> Profile
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="flex items-center gap-2 px-8 py-2.5 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg transition-all font-semibold text-slate-600"
          >
            <Package size={18} /> Orders
          </TabsTrigger>
        </TabsList>

        {/* PROFILE TAB */}
        <TabsContent value="profile" className="focus-visible:outline-none">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header Branding */}
            <div className="h-32 bg-slate-900 relative">
              <div className="absolute inset-0 bg-linear-to-r from-blue-600/20 to-transparent" />
            </div>

            <div className="px-6 md:px-12 pb-12">
              <div className="flex flex-col lg:flex-row gap-12 items-start -mt-12">
                {/* LEFT: STATIC PROFILE IMAGE */}
                <div className="flex flex-col items-center z-10">
                  <div className="flex flex-col items-center z-10">
                    <div className="relative group">
                      <img
                        src={updatedUser?.profilePic || userLogo}
                        alt="profile"
                        className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-xl"
                      />

                      <input
                        type="file"
                        accept="image/*"
                        id="profilePicInput"
                        className="hidden"
                        onChange={handleFileChange}
                      />

                      <label
                        htmlFor="profilePicInput"
                        className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 shadow-lg transition cursor-pointer"
                      >
                        <Camera size={16} />
                      </label>
                    </div>
                  </div>

                  <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {updatedUser?.firstName} Account
                  </p>
                </div>

                {/* RIGHT : PROFILE FORM */}
                <form
                  onSubmit={handleSubmit}
                  encType="multipart/form-data"
                  className="flex-1 w-full space-y-8"
                >
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                      Update Profile
                    </h1>
                    <p className="text-slate-500 text-sm">
                      Personalize your account settings and preferences.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase ml-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        placeholder="John"
                        name="firstName"
                        value={updatedUser.firstName}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase ml-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        placeholder="Doe"
                        name="lastName"
                        value={updatedUser.lastName}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase ml-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        name="email"
                        disabled
                        value={updatedUser.email}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase ml-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your Contact No"
                        name="phoneNo"
                        value={updatedUser.phoneNo || ""}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase ml-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your Address"
                      name="address"
                      value={updatedUser.address || ""}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase ml-1">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your City"
                        name="city"
                        value={updatedUser.city || ""}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase ml-1">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your ZipCode"
                        name="zipCode"
                        value={updatedUser.zipCode || ""}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full md:w-auto bg-blue-600 text-white px-12 py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all cursor-pointer active:scale-95"
                  >
                    Update Profile
                  </button>
                </form>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ORDERS TAB */}
        <TabsContent value="orders" className="focus-visible:outline-none">
          <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={32} className="text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">No Orders Yet</h2>
            <p className="text-slate-500 mt-2 max-w-xs mx-auto">
              Looks like you haven't made any tech purchases recently.
            </p>
            <button className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition cursor-pointer">
              Start Shopping
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
