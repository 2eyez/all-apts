import Announcement from "./components/Announcement";
import Navbar from "./components/Navbar";
import PopularDestinations from "./components/PopularDestinations";
import FeaturedApartments from "./components/FeaturedApartments";
import GuestReviews from "./components/GuestReviews";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="sticky top-0 z-50">
        <Announcement />
        <Navbar />
      </div>

      {/* Hero Section */}
      <section
        className="relative overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: "url('/hero.jpeg')",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/45"></div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
              Find the perfect
              <span className="text-blue-400"> shortlet apartment</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-200">
              Discover comfortable shortlet apartments for your next stay.
              Search, compare, and book apartments that fit your needs.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-10 rounded-2xl border border-white/20 bg-white/95 p-4 shadow-2xl backdrop-blur-sm">
            <div className="grid gap-4 md:grid-cols-4">
              {/* Location */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Location
                </label>

                <input
                  type="text"
                  placeholder="Where are you staying?"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-600"
                />
              </div>

              {/* Check-in */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Check-in
                </label>

                <input
                  type="date"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-600"
                />
              </div>

              {/* Check-out */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Check-out
                </label>

                <input
                  type="date"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-600"
                />
              </div>

              {/* Guests */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Guests
                </label>

                <input
                  type="number"
                  min="1"
                  placeholder="Number of guests"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-600"
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
              >
                <i className="ri-search-line text-lg"></i>
                Search
              </button>
            </div>
          </div>
        </div>
      </section>
      <PopularDestinations />
      <FeaturedApartments />

      {/* Why Choose All-Apts */}
      <section className="mx-auto max-w-[1500px] px-4 pt-8 pb-2 md:px-6 md:pt-10 md:pb-4">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
            Why All-Apts
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Everything you need for a better shortlet stay
          </h2>

          <p className="mt-4 text-gray-600">
            Find quality shortlet apartments, book with confidence, and enjoy a
            smooth stay from check-in to check-out.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 p-6">
            <i className="ri-shield-check-line text-3xl text-blue-600"></i>

            <h3 className="mt-5 text-lg font-semibold text-gray-900">
              Verified Apartments
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Discover quality apartments that meet our listing standards.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 p-6">
            <i className="ri-search-line text-3xl text-blue-600"></i>

            <h3 className="mt-5 text-lg font-semibold text-gray-900">
              Easy to Find
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Search and discover shortlets based on your preferred location and
              needs.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 p-6">
            <i className="ri-calendar-check-line text-3xl text-blue-600"></i>

            <h3 className="mt-5 text-lg font-semibold text-gray-900">
              Simple Booking
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Choose your apartment and book your stay without unnecessary
              hassle.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 p-6">
            <i className="ri-customer-service-2-line text-3xl text-blue-600"></i>

            <h3 className="mt-5 text-lg font-semibold text-gray-900">
              Guest Support
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Get support whenever you need help with your booking or stay.
            </p>
          </div>
        </div>
      </section>

      {/* Explore by Property Type */}
      <section className="mx-auto max-w-[1500px] px-4 pt-10 pb-4 md:px-6 md:pt-14 md:pb-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            Explore by Type
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Find an apartment that fits your stay
          </h2>

          <p className="mt-4 text-gray-600">
            Explore different apartment types and find the perfect space for
            your next shortlet stay.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <div className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-md">
            <div className="h-40 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
                alt="Self Contain"
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900">Self Contain</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comfortable & compact
              </p>
            </div>
          </div>

          <div className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-md">
            <div className="h-40 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80"
                alt="1 Bedroom"
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900">1 Bedroom</h3>
              <p className="mt-1 text-sm text-gray-500">Perfect for couples</p>
            </div>
          </div>

          <div className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-md">
            <div className="h-40 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"
                alt="2 Bedroom"
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900">2 Bedroom</h3>
              <p className="mt-1 text-sm text-gray-500">Ideal for families</p>
            </div>
          </div>

          <div className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-md">
            <div className="h-40 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                alt="3 Bedroom"
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900">3 Bedroom</h3>
              <p className="mt-1 text-sm text-gray-500">Spacious & luxurious</p>
            </div>
          </div>

          <div className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-md">
            <div className="h-40 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80"
                alt="Luxury Apartment"
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900">Luxury</h3>
              <p className="mt-1 text-sm text-gray-500">Premium shortlets</p>
            </div>
          </div>
        </div>
      </section>

      {/* How All-Apts Works */}
      <section className="mx-auto max-w-[1500px] px-4 pt-4 pb-16 md:px-6 md:pt-6 md:pb-20">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            How It Works
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Book your shortlet in three simple steps
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Finding and booking your next shortlet apartment is simple with
            All-Apts.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Step 1 */}
          <div className="rounded-2xl border border-gray-200 p-7 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <i className="ri-search-line text-2xl text-blue-600"></i>
            </div>

            <div className="mt-5 text-sm font-semibold text-gray-400">
              STEP 01
            </div>

            <h3 className="mt-2 text-xl font-semibold text-gray-900">Search</h3>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Search for shortlet apartments based on your preferred location,
              dates, and number of guests.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl border border-gray-200 p-7 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <i className="ri-home-heart-line text-2xl text-blue-600"></i>
            </div>

            <div className="mt-5 text-sm font-semibold text-gray-400">
              STEP 02
            </div>

            <h3 className="mt-2 text-xl font-semibold text-gray-900">Choose</h3>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Compare apartments, explore their amenities, and choose the one
              that fits your stay.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border border-gray-200 p-7 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <i className="ri-calendar-check-line text-2xl text-blue-600"></i>
            </div>

            <div className="mt-5 text-sm font-semibold text-gray-400">
              STEP 03
            </div>

            <h3 className="mt-2 text-xl font-semibold text-gray-900">Book</h3>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Confirm your booking and get ready to enjoy a comfortable shortlet
              stay.
            </p>
          </div>
        </div>
      </section>
      {/* Become a Host */}
      <section className="mx-auto max-w-[1500px] px-4 pt-4 pb-6 md:px-6 md:pt-6 md:pb-8">
        <div className="grid items-center gap-10 overflow-hidden rounded-3xl bg-gray-100 p-6 md:grid-cols-2 md:p-10 lg:p-14">
          {/* Text */}
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
              Become a Host
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Turn your apartment into an opportunity
            </h2>

            <p className="mt-5 max-w-xl text-gray-600">
              List your shortlet apartment on All-Apts and connect with guests
              looking for comfortable places to stay.
            </p>

            <button
              type="button"
              className="mt-7 rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-blue-600"
            >
              List Your Shortlet
            </button>
          </div>

          {/* Image */}
          <div className="w-full">
            <img
              src="/host.jpeg"
              alt="Become a host on All-Apts"
              className="w-full h-72 object-cover rounded-2xl"
            />
          </div>
        </div>
      </section>

      <GuestReviews />
      <Footer />
    </main>
  );
}
