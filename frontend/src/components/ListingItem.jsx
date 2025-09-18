import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({ listing }) {
  return (
    <div className="bg-white shadow-md hover:shadow-xl transition rounded-xl overflow-hidden w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        {/* Image Section */}
        <div className="relative">
          <img
            src={
              listing.imageUrls[0] ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn4JTY7L27MRn3LZO6EaGKAdj0YOTE6qfh5W7e66AwORT75mo54A2JLoRn0X31SSg33fM&usqp=CAU"
            }
            alt="listing cover"
            className="h-[220px] w-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {/* Price Badge */}
          <span className="absolute bottom-2 left-2 bg-blue-800 text-white text-xs px-3 py-1 rounded-full shadow">
            {listing.offer
              ? `$${listing.discountPrice.toLocaleString("en-US")}`
              : `$${listing.regularPrice.toLocaleString("en-US")}`}
            {listing.type === "rent" && " /month"}
          </span>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col gap-2">
          <p className="truncate text-lg font-semibold text-slate-800">
            {listing.name}
          </p>
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <MdLocationOn className="h-4 w-4 text-green-600" />
            <p className="truncate">{listing.address}</p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>

          {/* Beds & Baths */}
          <div className="flex gap-2 mt-3">
            <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-medium">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Beds`
                : `${listing.bedrooms} Bed`}
            </span>
            <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-medium">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Baths`
                : `${listing.bathrooms} Bath`}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
