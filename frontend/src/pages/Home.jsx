import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import { BASE_URL } from "../constant/constant.js";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/listing/get?offer=true&limit=4`);
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/listing/get?type=rent&limit=4`);
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/listing/get?type=sale&limit=4`);
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center gap-6 px-3 py-20 lg:py-30 ">
        <h1 className="text-slate-800 font-extrabold text-4xl lg:text-6xl leading-tight">
          Find your <span className="text-blue-800">perfect</span>
          <br /> place where you feel{" "}
          <span className="text-green-600 font-extrabold">comfortable</span>
        </h1>

        <p className="text-gray-500 text-sm sm:text-base max-w-2xl">
          My Estate is the best place to discover your dream home. <br />
          We have a wide range of properties for you to choose from.
        </p>
        <Link
          to="/search"
          className="px-6 py-3 bg-blue-800 text-white text-sm sm:text-base font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Let’s Get Started
        </Link>
      </div>

      {/* Swiper Section */}
      <div className="ng-gray-50 max-w-6xl mx-auto px-3 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* Left: Swiper Slider */}
        <div>
          <Swiper navigation className="rounded-xl shadow-lg overflow-hidden">
            {offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div
                  className="h-[300px] sm:h-[400px] lg:h-[500px] relative"
                  style={{
                    background: `url(https://media.newhomeinc.com/348/2022/11/30/The-Apex-Georgian-Elevation-1.jpeg?width=1000&height=666&fit=bounds&ois=0360179) center/cover no-repeat`,
                  }}
                >
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Right: Offer Description */}
        <div className="flex flex-col justify-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Exclusive Special Offers ✨
          </h2>
          <p className="text-gray-600 leading-relaxed">
            At <span className="font-semibold">My Real Estate</span>, we bring you
            exclusive <span className="text-blue-600 font-semibold">special offers</span>
            designed to make property ownership more rewarding.
            From discounted prices to flexible payment plans, our offers
            provide amazing <span className="font-medium">benefits for buyers and investors</span>.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Don’t miss out — explore our latest deals today and grab the opportunity
            to own your dream property at the best value.
          </p>
          <Link to="/search?offer=true"
            className="px-6 py-3 bg-blue-800 text-white text-sm sm:text-base font-semibold rounded-lg shadow-md hover:bg-blue-700 transition text-center w-max 
             mx-auto lg:mx-0
            ">
            Explore Offers
          </Link>
        </div>
      </div>


      {/* Listings Section */}
      <div className="max-w-6xl mx-auto p-6 flex flex-col gap-12 my-12">
        {offerListings.length > 0 && (
          <div>
            <div className="my-3 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-700 border-b-4 border-blue-500 pb-1">
                Recent Offers
              </h2>
              <Link
                className="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition"
                to="/search?offer=true"
              >
                Show More
              </Link>
            </div>
            <div className="flex flex-wrap gap-6">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {rentListings.length > 0 && (
          <div>
            <div className="my-3 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-700 border-b-4 border-green-500 pb-1">
                Recent Places for Rent
              </h2>
              <Link
                className="px-4 py-2 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition"
                to="/search?type=rent"
              >
                Show More
              </Link>
            </div>
            <div className="flex flex-wrap gap-6">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {saleListings.length > 0 && (
          <div>
            <div className="my-3 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-700 border-b-4 border-red-500 pb-1">
                Recent Places for Sale
              </h2>
              <Link
                className="px-4 py-2 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition"
                to="/search?type=sale"
              >
                Show More
              </Link>
            </div>
            <div className="flex flex-wrap gap-6">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
