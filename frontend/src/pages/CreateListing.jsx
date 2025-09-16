import React, { useState } from "react";
import { getStorage } from "firebase/storage";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    regularPrice: "2500000",
    discountPrice: "50",
    bathrooms: 1,
    bedrooms: 1,
    furnished: false,
    parking: false,
    type: "sale",
    offer: false,
    imageUrls: [],
  });
  console.log(formData);

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length < 7) {
      const promises = [];
      for (i = 0; i < files.length + formData.imageUrls.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(true);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };
  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.log(error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleDeleteImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({ ...formData, type: e.target.id });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    console.log("inside handle submit");
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch("api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Create New Listing
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Property Name */}
        <input
          id="name"
          type="text"
          placeholder="Property Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        />

        {/* Description */}
        <textarea
          id="description"
          placeholder="Property Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        />

        {/* Address */}
        <input
          id="address"
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        />

        {/* Price & Offer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            id="regularPrice"
            type="number"
            placeholder="Regular Price"
            value={formData.regularPrice}
            onChange={handleChange}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            min={2500000}
            max={1000000000}
            required
          />
          {formData.offer && (
            <input
              id="discountPrice"
              type="number"
              placeholder="Discount Price"
              value={formData.discountPrice}
              onChange={handleChange}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          )}
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            id="bedrooms"
            type="number"
            placeholder="Bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            min={1}
            max={10}
            required
          />
          <input
            id="bathrooms"
            type="number"
            placeholder="Bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            min={1}
            max={10}
            required
          />
        </div>

        {/* Type & Features */}
        <div className="flex flex-wrap gap-4">
          {["sale", "rent"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, type })}
              className={`px-4 py-2 rounded-lg font-semibold border ${
                formData.type === type
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              } transition`}
            >
              {type === "sale" ? "Sell" : "Rent"}
            </button>
          ))}
          {["furnished", "parking", "offer"].map((feature) => (
            <label key={feature} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={feature}
                checked={formData[feature]}
                onChange={handleChange}
                className="w-5 h-5"
              />
              {feature.charAt(0).toUpperCase() + feature.slice(1)}
            </label>
          ))}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-2 font-semibold">
            Upload Images (Max 6)
          </label>

          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files).slice(0, 6);
                const urls = files.map((file) => URL.createObjectURL(file));
                setFormData({ ...formData, imageUrls: urls });
              }}
              className="flex-1 border p-2 rounded"
            />

            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="px-4 py-2 text-green-700 border border-green-700 rounded uppercase hover:shadow-md disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            {formData.imageUrls.map((url, index) => (
              <div key={url} className="relative">
                <img
                  src={url}
                  alt={`Preview ${index}`}
                  className="w-full h-24 object-cover rounded"
                />
                <button
                  onClick={() => handleDeleteImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded text-xs"
                >
                  Delete
                </button>
                {index === 0 && (
                  <span className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-1 rounded">
                    Cover
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition cursor-pointer disabled:opacity-80"
        >
          {loading ? "Creating..." : "Create Listing"}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}
