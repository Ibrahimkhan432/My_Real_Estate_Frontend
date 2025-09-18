"use client";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    offer: false,
    furnished: false,
    parking: false,
    sort: "created_at",
    order: "desc",
  });
  //   console.log(sidebarData);

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  console.log(listings);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        offer: offerFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        parking: parkingFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      // setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();

      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }

      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebarData({ ...sidebarData, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[1] || "desc";

      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  //show more  listing
  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex flex-col lg:flex-row max-w-8xl mx-auto">
        {/* Enhanced Sidebar with Professional Styling */}
        <div className="lg:w-80 bg-white/80 backdrop-blur-sm border-r border-slate-200/60 shadow-lg">
          <div className="p-8 border-b border-slate-200/60">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">
              Search Filters
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Search Term */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700 tracking-wide">
                  Search Term
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="searchTerm"
                    placeholder="Enter location, property type..."
                    value={sidebarData.searchTerm}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/70 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 placeholder-slate-400"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg
                      className="w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Property Type */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700 tracking-wide">
                  Property Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "all", label: "All Properties" },
                    { id: "rent", label: "For Rent" },
                    { id: "sale", label: "For Sale" },
                    { id: "offer", label: "Special Offers" },
                  ].map((type) => (
                    <label
                      key={type.id}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        id={type.id}
                        className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                        checked={
                          type.id === "offer"
                            ? sidebarData.offer
                            : type.id === "all"
                            ? sidebarData.type === "all"
                            : sidebarData.type === type.id
                        }
                        onChange={handleChange}
                      />
                      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700 tracking-wide">
                  Amenities
                </label>
                <div className="space-y-3">
                  {[
                    { id: "parking", label: "Parking Available" },
                    { id: "furnished", label: "Fully Furnished" },
                  ].map((amenity) => (
                    <label
                      key={amenity.id}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        id={amenity.id}
                        className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                        checked={sidebarData[amenity.id]}
                        onChange={handleChange}
                      />
                      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
                        {amenity.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700 tracking-wide">
                  Sort By
                </label>
                <select
                  onChange={handleChange}
                  defaultValue="created_at_desc"
                  id="sort_order"
                  className="w-full px-4 py-3 bg-white/70 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-slate-700"
                >
                  <option value="regularPrice_desc">Price: High to Low</option>
                  <option value="regularPrice_asc">Price: Low to High</option>
                  <option value="createdAt_desc">Newest First</option>
                  <option value="createdAt_asc">Oldest First</option>
                </select>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className=" cursor-pointer w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                Search Properties
              </button>
            </form>
          </div>
        </div>

        <div className="flex-1 min-h-screen">
          <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Property Listings
                </h1>
                <p className="text-slate-600 mt-2">
                  {!loading &&
                    listings.length > 0 &&
                    `${listings.length} properties found`}
                </p>
              </div>
              {!loading && listings.length > 0 && (
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                  <span>Grid View</span>
                </div>
              )}
            </div>
          </div>

          {/* Results Content */}
          <div className="p-2 gap-2">
            {loading && (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-lg font-medium text-slate-600">
                  Searching properties...
                </p>
              </div>
            )}

            {/* No Results */}
            {!loading && listings.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-12 h-12 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  No Properties Found
                </h3>
                <p className="text-slate-500 text-center max-w-md">
                  Try adjusting your search criteria or browse all available
                  properties.
                </p>
              </div>
            )}

            {/* Listings Grid */}
            {!loading && listings.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
                {listings.map((listing) => (
                  <div
                    key={listing._id}
                    className="group hover:scale-[1.02] transition-transform duration-200"
                  >
                    <ListingItem listing={listing} />
                  </div>
                ))}
              </div>
            )}

            {/* Show More Button */}
            {showMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={onShowMoreClick}
                  className="bg-white/80 backdrop-blur-sm border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Load More Properties
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
