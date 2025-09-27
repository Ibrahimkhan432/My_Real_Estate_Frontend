import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../constant/constant.js";

export default function CreateListing() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

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
  });

  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (["sale", "rent"].includes(e.target.id)) {
      setFormData({ ...formData, type: e.target.id });
    } else if (["parking", "furnished", "offer"].includes(e.target.id)) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files).slice(0, 6);
    setFiles(selected);
    setImagePreviews(selected.map((file) => URL.createObjectURL(file)));
  };

  const handleDeleteImage = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    setImagePreviews(updatedFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (files.length < 1) return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");

      setLoading(true);
      setError(false);

      const fd = new FormData();
      Object.keys(formData).forEach((key) => {
        fd.append(key, formData[key]);
      });

      files.forEach((file) => {
        fd.append("images", file);
      });

      const res = await fetch(`${BASE_URL}/api/listing/create`, {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      navigate(`/listing/${data._id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Create New Listing</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input id="name" type="text" placeholder="Property Name"
          value={formData.name} onChange={handleChange} className="w-full border p-3 rounded-lg" required />
        <textarea id="description" placeholder="Property Description"
          value={formData.description} onChange={handleChange} className="w-full border p-3 rounded-lg" required />
        <input id="address" type="text" placeholder="Address"
          value={formData.address} onChange={handleChange} className="w-full border p-3 rounded-lg" required />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input id="regularPrice" type="number" placeholder="Regular Price"
            value={formData.regularPrice} onChange={handleChange}
            className="border p-3 rounded-lg" required />
          {formData.offer && (
            <input id="discountPrice" type="number" placeholder="Discount Price"
              value={formData.discountPrice} onChange={handleChange}
              className="border p-3 rounded-lg" required />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input id="bedrooms" type="number" placeholder="Bedrooms"
            value={formData.bedrooms} onChange={handleChange}
            className="border p-3 rounded-lg" required />
          <input id="bathrooms" type="number" placeholder="Bathrooms"
            value={formData.bathrooms} onChange={handleChange}
            className="border p-3 rounded-lg" required />
        </div>

        <div className="flex flex-wrap gap-4">
          {["sale", "rent"].map((type) => (
            <button key={type} type="button"
              onClick={() => setFormData({ ...formData, type })}
              className={`px-4 py-2 rounded-lg font-semibold border ${formData.type === type
                ? "bg-blue-800 text-white"
                : "bg-white text-slate-700"}`}>
              {type === "sale" ? "Sell" : "Rent"}
            </button>
          ))}
          {["furnished", "parking", "offer"].map((feature) => (
            <label key={feature} className="flex items-center gap-2">
              <input type="checkbox" id={feature} checked={formData[feature]}
                onChange={handleChange} className="w-5 h-5" />
              {feature}
            </label>
          ))}
        </div>

        {/* images */}
        <div>
          <label className="block mb-2 font-semibold">Upload Images (Max 6)</label>
          <input type="file" accept="image/*" multiple onChange={handleFileChange}
            className="border p-2 rounded" />
          <div className="grid grid-cols-3 gap-2 mt-3">
            {imagePreviews.map((url, index) => (
              <div key={url} className="relative">
                <img src={url} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded" />
                <button type="button" onClick={() => handleDeleteImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded text-xs">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* submit */}
        <button type="submit" disabled={loading}
          className="w-full bg-blue-800 text-white py-3 rounded-lg font-semibold">
          {loading ? "Creating..." : "Create Listing"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}
