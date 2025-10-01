import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signInFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { BASE_URL } from "../constant/constant.js";
import { toast } from "react-toastify";

const Profile = () => {
  const { currentUser, loading } = useSelector((state) => state.user);
  const fileRef = useRef();
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const [showListingError, setShowListingError] = useState(false);
  const [formData, setFormData] = useState({
    userName: currentUser?.userName || "",
    email: currentUser?.email || "",
    password: "",
    img: currentUser?.img || "",
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => setFileUploadError(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({ ...prev, img: downloadURL }));
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // handle update user
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      const body = { ...formData };
      if (!body.password || body.password.trim() === "") {
        delete body.password;
      }

      const res = await fetch(
        `${BASE_URL}/api/user/update/${currentUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      toast.success("Profile updated successfully");
      console.log(data);
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        toast.error(data.message || "Failed to update profile");
        console.error("Update failed:", data.message);
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      console.log("Update successful:", data);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  // handle user delete
  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(
        `${BASE_URL}/api/user/delete/${currentUser._id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      navigate("/sign-in", { replace: true });
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    } finally {
      setIsModalOpen(false);
    }
  };

  // handle user signout
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(`${BASE_URL}/api/auth/signout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      if (res.data === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
      toast.success("Signed out successfully!");
      localStorage.removeItem("access_token");
      navigate("/sign-in");
    } catch (error) {
      dispatch(signInFailure(error.message));
      toast.error("Something went wrong. Please try again.");
    }
  };

  // show listing
  const handleShowListing = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(
        `${BASE_URL}/api/user/listings/${currentUser._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await res.json();
      console.log("data", res.json());
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingError(error.message);
    }
  };

  // handle listing delete
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/listing/delete/${listingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setShowListingError(data.message);
        return;
      }
      handleShowListing();
    } catch (error) {
      setShowListingError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Main Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden mb-8">
          <div className="bg-blue-800 px-8 py-6">
            <h2 className="text-2xl font-semibold text-white">
              Profile Information
            </h2>
            <p className="text-blue-100 mt-1">
              Update your personal details and preferences
            </p>
          </div>

          <form onSubmit={handleUpdate} className="p-8 space-y-8">
            <div className="flex flex-col items-center">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <div className="relative group">
                <div className="w-36 h-36 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 p-1">
                  <img
                    onClick={() => fileRef.current.click()}
                    src={
                      currentUser?.img ||
                      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png" ||
                      "/placeholder.svg"
                    }
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover cursor-pointer transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                  />
                </div>
                {/* Upload Status Indicators */}
                {filePerc > 0 && filePerc < 100 && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-800 text-white text-xs px-3 py-1 rounded-full shadow-lg">
                    Uploading {filePerc}%
                  </div>
                )}
                {filePerc === 100 && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow-lg">
                    Upload Complete!
                  </div>
                )}
                {fileUploadError && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow-lg">
                    Upload failed. Try smaller image.
                  </div>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold text-slate-700 mb-3"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  id="userName"
                  type="text"
                  value={formData.userName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 text-slate-900 placeholder-slate-400"
                  placeholder="Enter your username"
                />
              </div>

              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold text-slate-700 mb-3"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 text-slate-900 placeholder-slate-400"
                  placeholder="Enter your email"
                />
              </div>

              <div className="lg:col-span-2 space-y-2">
                <label
                  className="block text-sm font-semibold text-slate-700 mb-3"
                  htmlFor="password"
                >
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  onChange={handleChange}
                  placeholder="Enter new password (leave blank to keep current)"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 text-slate-900 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Professional Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
              <button
                disabled={loading}
                className="cursor-pointer flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="cursor-pointer w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Updating Profile...
                  </span>
                ) : (
                  "Update Profile"
                )}
              </button>

              <Link to="/create-listing" className="flex-1">
                <button
                  disabled={loading}
                  className="cursor-pointer w-full bg-green-600 hover:from-green-700 hover:to-emerald-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  {loading ? "Processing..." : "Create New Listing"}
                </button>
              </Link>
            </div>
          </form>
        </div>

        {/* Account Management Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/50 p-4 mb-8">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">
            Account Management
          </h3>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-4">
              <button
                onClick={handleShowListing}
                className="cursor-pointer px-6 py-3 bg-blue-800 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                {" "}
                Show Listings{" "}
              </button>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSignOut}
                className="cursor-pointer px-5 py-2.5 rounded-full font-semibold text-sm
             bg-blue-800 text-white hover:-translate-y-0.5
             shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-900
             active:scale-95 transition-all duration-200"
              >
                Sign Out
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="cursor-pointer px-4 py-2 text-red-600 hover:text-red-700 font-medium hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                Delete Account
              </button>

              {/*Delete Button Modal */}
              {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-100 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-lg p-6 sm:w-120 text-center">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Are you sure?
                    </h2>
                    <p className="text-sm text-gray-600 mt-2">
                      This action cannot be undone.
                    </p>

                    <div className="flex justify-between mt-6 gap-3">
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="cursor-pointer flex-1 px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        className="cursor-pointer flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {userListings && userListings.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/50 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Your Property Listings
              </h2>
              <p className="text-slate-600">
                Manage and edit your active property listings
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {userListings.map((listing) => (
                <div
                  key={listing._id}
                  className="group bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
                >
                  <Link to={`/listing/${listing._id}`} className="block">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={listing.imageUrls[0] || "/placeholder.svg"}
                        alt="Property listing"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  <div className="p-6">
                    <Link
                      to={`/listing/${listing._id}`}
                      className="block font-semibold text-lg text-slate-900 hover:text-blue-600 transition-colors duration-200 mb-4 line-clamp-2"
                    >
                      {listing.name}
                    </Link>

                    <div className="flex gap-3">
                      <Link
                        to={`/update-listing/${listing._id}`}
                        className="flex-1"
                      >
                        <button className="cursor-pointer w-full px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleListingDelete(listing._id)}
                        className="cursor-pointer px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
