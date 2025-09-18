import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  return (
    <>
      {landlord && (
        <div>
          <p>
            contact {landlord?.name} for the listing {listing.name}
          </p>
          <textarea
            className="border border-slate-500 p-2 w-full"
            id="message"
            name="message"
            placeholder="Your message"
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?Subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-500 text-center cursor-pointer text-white w-full py-2 rounded mt-2 hover:bg-slate-600"
          >
            Send message
          </Link>
        </div>
      )}
    </>
  );
}
