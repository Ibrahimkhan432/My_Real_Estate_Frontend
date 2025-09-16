export default function About() {
  return (
    <section className="py-16 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
      {/* Heading Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 leading-tight">
          About <span className="text-blue-600">MyReal Estate</span>
        </h1>
        <p className="mt-4 text-slate-600 text-base md:text-lg max-w-3xl mx-auto">
          Trusted real estate partner helping clients buy, sell, and rent properties with ease and confidence.
        </p>
      </div>

      {/* Content Section */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Left Side - Text */}
        <div className="space-y-6">
          <p className="text-slate-700 leading-relaxed text-base md:text-lg">
            <span className="font-semibold">MyReal Estate</span> is a leading
            real estate agency that specializes in helping clients buy, sell,
            and rent properties in the most desirable neighborhoods. Our team of
            experienced agents is dedicated to providing exceptional service and
            making the process smooth.
          </p>
          <p className="text-slate-700 leading-relaxed text-base md:text-lg">
            Our mission is to empower clients to achieve their real estate goals
            by offering expert advice, personalized service, and deep local
            market knowledge. Whether buying, selling, or renting — we are here
            to support every step of the way.
          </p>
          <p className="text-slate-700 leading-relaxed text-base md:text-lg">
            With years of industry experience, our agents are committed to
            delivering the highest level of service. We believe property
            transactions should be exciting and rewarding, not stressful.
          </p>
        </div>

        {/* Right Side - Image */}
        <div className="flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80"
            alt="About MyReal Estate"
            className="rounded-2xl shadow-lg w-full h-[320px] object-cover md:h-[400px] lg:h-[450px]"
          />
        </div>
      </div>
    </section>
  );
}


  // handle user submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        console.error("Update failed:", data.message);
        return;
      }
      dispatch(updateUserSuccess(data));
      console.log("Update successful:", data);

    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  // handle user delete
  const handleDeleteAccount = async (e) => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        console.error("Delete failed:", data.message);
        return;
      }
      dispatch(deleteUserSuccess(data));
      console.log("Delete successful:", data);
      navigate("/sign-in", {
        replace: true
      })
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  // handle user signout
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (res.data === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }

  // show listing
  const handleShowListing = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      console.log("user listing res (126): ", res);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingError(error.message);
    }
  }

  // handle listing delete
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
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
  }
