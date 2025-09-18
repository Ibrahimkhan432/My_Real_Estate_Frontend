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

