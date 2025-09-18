import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/user/${listing.userRef}`
        );
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  if (loading) {
    return <p className="text-gray-500">Loading contact info...</p>;
  }

  if (!landlord) {
    return (
      <p className="text-red-500">
        Failed to fetch contact details. Please try again later.
      </p>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Contact <span className="text-indigo-600">{landlord?.name}</span>
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Regarding the listing:{" "}
        <span className="font-medium text-gray-900">{listing.name}</span>
      </p>

      <textarea
        className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
        id="message"
        name="message"
        placeholder="Write your message here..."
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>

      <Link
        to={`mailto:${landlord.email}?Subject=Regarding ${listing.name}&body=${encodeURIComponent(
          message
        )}`}
        className={`flex items-center justify-center gap-2 mt-3 py-2.5 rounded-lg text-white transition-all duration-200 ${message.trim()
          ? "bg-blue-800 hover:bg-blue-700 cursor-pointer"
          : "bg-gray-400 cursor-not-allowed"
          }`}
        onClick={(e) => {
          if (!message.trim()) {
            e.preventDefault();
            alert("Please type a message before sending.");
          }
        }}
      >
        <Mail size={18} />
        Send Message
      </Link>
    </div>
  );
}
