import Link from "next/link";

const apartments = [
  {
    id: "1",
    name: "Luxury 2 Bedroom Apartment",
    location: "Lekki, Lagos",
    type: "2 Bedroom",
    guests: "4 Guests",
    price: "₦120,000",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "2",
    name: "Modern City Apartment",
    location: "Wuse 2, Abuja",
    type: "1 Bedroom",
    guests: "2 Guests",
    price: "₦95,000",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "3",
    name: "Executive Serviced Apartment",
    location: "Victoria Island, Lagos",
    type: "3 Bedroom",
    guests: "6 Guests",
    price: "₦180,000",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "4",
    name: "Elegant Shortlet Apartment",
    location: "Garki, Abuja",
    type: "2 Bedroom",
    guests: "4 Guests",
    price: "₦110,000",
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "5",
    name: "Elegant Shortlet Apartment",
    location: "Garki, Abuja",
    type: "2 Bedroom",
    guests: "4 Guests",
    price: "₦110,000",
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "6",
    name: "Elegant Shortlet Apartment",
    location: "Garki, Abuja",
    type: "2 Bedroom",
    guests: "4 Guests",
    price: "₦110,000",
    rating: "4.7",
    listedBy: "All-Apts",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
  },
];

export default function FeaturedApartments() {
  return (
    <section className="mx-auto max-w-[1500px] px-4 pt-8 pb-2 md:px-6 md:pt-10 md:pb-4">
      {/* Heading */}
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-medium text-gray-500">
            HANDPICKED FOR YOU
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Featured Apartments
          </h2>

          <p className="mt-3 max-w-2xl text-gray-600">
            Explore some of our most popular shortlet apartments, selected for
            comfort, location and quality.
          </p>
        </div>

        <button className="hidden text-sm font-semibold text-gray-900 transition hover:text-gray-600 md:block">
          View all apartments →
        </button>
      </div>

      {/* Apartment Cards */}
      <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
        {apartments.map((apartment) => (
          <article
            key={apartment.id}
            className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-1 hover:shadow-md"
          >
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={apartment.image}
                alt={apartment.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />

              {/* Rating */}
              <div className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-900 shadow-sm">
                ★ {apartment.rating}
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900">
                {apartment.name}
              </h3>

              <p className="mt-1 text-sm text-gray-500">{apartment.location}</p>

              {/* Details */}
              <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
                <span>{apartment.type}</span>

                <span className="text-gray-300">•</span>

                <span>{apartment.guests}</span>
              </div>

              {/* Price */}
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <span className="text-xl font-bold text-gray-900">
                    {apartment.price}
                  </span>

                  <span className="ml-1 text-sm text-gray-500">/ night</span>
                </div>

                <Link
                  href={`/apartments/${apartment.id}`}
                  className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
                >
                  View
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Mobile View All */}
      <button className="mt-6 w-full rounded-full border border-gray-300 py-3 text-sm font-semibold text-gray-900 md:hidden">
        View all apartments
      </button>
    </section>

  );
}
