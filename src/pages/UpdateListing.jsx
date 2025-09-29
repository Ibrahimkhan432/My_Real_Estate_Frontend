import React, { use, useEffect, useState } from "react";
import { getStorage } from "firebase/storage";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../constant/constant.js";

export default function CreateListing() {
    const params = useParams();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
    console.log(currentUser);
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
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);


    // checking user
    useEffect(() => {
        const listingId = params.listingId;
        const fetchListing = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/listing/get/${listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    console.log(data.message);
                    return;
                }
                setFormData(data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchListing();
    }, [])

    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length < 7) {
            const promises = [];
            for (i = 0; i < files.length + formData.imageUrls.length; i++) {
                promises.push(
                    storeImage(files[i])
                )
            }
            Promise.all(promises)
                .then((urls) => {
                    setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
                    setImageUploadError(true);
                })
                .catch((err) => {
                    setImageUploadError('Image upload failed (2 mb max per image)');
                    setUploading(false);
                });

        } else {
            setImageUploadError('You can only upload 6 images per listing');
            setUploading(false);
        }
    };
    const storeImage = (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
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
            )
        });
    }

    const handleDeleteImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        });
    };

    const handleChange = (e) => {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({ ...formData, type: e.target.id })
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setFormData({ ...formData, [e.target.id]: e.target.checked });
        }
        if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({
                ...formData, [e.target.id]: e.target.value
            });
        }
    }

    const handleSubmit = async (e) => {
        console.log("inside handle submit");
        e.preventDefault();
        try {
            if (formData.imageUrls.length < 1)
                return setError('You must upload at least one image');
            if (+formData.regularPrice < +formData.discountPrice)
                return setError('Discount price must be lower than regular price');
            setLoading(true);
            setError(false);
            const res = await fetch(`${BASE_URL}/api/listing/update/${params.listingId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                Credentials: "include",
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }

                ),
            });
            const data = await res.json();
            console.log(data);
            if (data.success === false) {
                setError(data.message);
                setLoading(false);
                return;
            }
            navigate(`/profile`);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-6">
            <h2 className="text-2xl font-bold mb-4">Update your Listing</h2>
            <form className="grid gap-4"
                onSubmit={handleSubmit}
            >

                <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Property Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />

                <textarea
                    name="description"
                    id="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />

                <input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />

                <input
                    type="number"
                    name="regularPrice"
                    id="regularPrice"
                    placeholder="Regular Price"
                    value={formData.regularPrice}
                    min={2500000}
                    max={1000000000}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />
                {formData.offer && (
                    <input
                        type="number"
                        name="discountPrice"
                        id="discountPrice"
                        placeholder="Discount Price"
                        value={formData.discountPrice}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                    />
                )}
                <input
                    type="number"
                    name="bathrooms"
                    id="bathrooms"
                    min={1}
                    max={10}
                    placeholder="No. of Bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="number"
                    name="bedrooms"
                    id="bedrooms"
                    min={1}
                    max={10}
                    placeholder="No. of Bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="furnished"
                        id="furnished"
                        checked={formData.furnished}
                        onChange={handleChange}
                    />
                    Furnished
                </label>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="parking"
                        id="parking"
                        checked={formData.parking}
                        onChange={handleChange}
                    />
                    Parking
                </label>
                <div className='flex gap-2'>
                    <input
                        type='checkbox'
                        id='sale'
                        className='w-5'
                        onChange={handleChange}
                        checked={formData.type === 'sale'}
                    />
                    <span>Sell</span>
                </div>
                <div className='flex gap-2'>
                    <input
                        type='checkbox'
                        id='rent'
                        className='w-5'
                        onChange={handleChange}
                        checked={formData.type === 'rent'}
                    />
                    <span>Rent</span>
                </div>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="offer"
                        id="offer"
                        checked={formData.offer}
                        onChange={handleChange}
                    />
                    Special Offer
                </label>

                <div>
                    <label className="block mb-2 font-semibold">
                        Upload Images (First image will be cover image) — Max 6
                    </label>

                    <input
                        type="file"
                        name="images"
                        id="images"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                            const files = Array.from(e.target.files).slice(0, 6); // limit max 6
                            const urls = files.map((file) => URL.createObjectURL(file));
                            setFormData({ ...formData, imageUrls: urls });
                        }}
                        className="border p-2 rounded mb-2 w-full"
                    />

                    <button
                        type="button"
                        disabled={uploading}
                        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm"
                        onClick={handleImageSubmit}
                    >
                        {
                            uploading ? 'Uploading...' : 'Upload'
                        }
                    </button>
                    {formData.imageUrls.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-3">
                            {formData.imageUrls.map((url, index) => (
                                <div key={url} className="relative">
                                    <img
                                        src={url}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-24 object-cover rounded"
                                    />
                                    <button
                                        onClick={() => handleDeleteImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded">Delete </button>
                                    {index === 0 && (
                                        <span className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-1 rounded">
                                            Cover
                                        </span>
                                    )}
                                </div>

                            ))}
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={loading || uploading}
                    className="cursor-pointer bg-blue-800 text-white p-2 rounded hover:bg-blue-700"
                >
                    {
                        loading ? 'updating...' : 'Update Listing'
                    }
                </button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
        </div>
    );
}
