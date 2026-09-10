import ApartmentGallery from "../../components/ApartmentGallery";

type Apartment = {
  id: string;
  name: string;
  location: string;
  type: string;
  guests: string;
  price: string;
  rating: string;
  listedBy: string;
  image: string;
  images: string[];
};

const apartments: Apartment[] = [
  {
    id: "1",
    name: "Luxury 2 Bedroom Apartment",
    location: "Lekki, Lagos",
    type: "2 Bedroom",
    guests: "4 Guests",
    price: "₦120,000",
    rating: "4.9",
    listedBy: "All-Apts",

    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",

    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  {
    id: "2",
    name: "Modern City Apartment",
    location: "Wuse 2, Abuja",
    type: "1 Bedroom",
    guests: "2 Guests",
    price: "₦95,000",
    rating: "4.8",
    listedBy: "All-Apts",

    image:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=80",

    images: [
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  {
    id: "3",
    name: "Executive Serviced Apartment",
    location: "Victoria Island, Lagos",
    type: "3 Bedroom",
    guests: "6 Guests",
    price: "₦180,000",
    rating: "4.9",
    listedBy: "All-Apts",

    image:
      "https://images.unsplash.com/photo-1600566753051-8c0b?auto=format&fit=crop&w=1200&q=80",

    images: [
      "https://images.unsplash.com/photo-1600566753051-8c0b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600573472550-8090b5e4b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  {
    id: "4",
    name: "Elegant Shortlet Apartment",
    location: "Garki, Abuja",
    type: "2 Bedroom",
    guests: "4 Guests",
    price: "₦110,000",
    rating: "4.7",
    listedBy: "All-Apts",

    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",

    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  {
    id: "5",
    name: "Premium Poolside Apartment",
    location: "Ikoyi, Lagos",
    type: "2 Bedroom",
    guests: "4 Guests",
    price: "₦150,000",
    rating: "4.9",
    listedBy: "All-Apts",

    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",

    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  {
    id: "6",
    name: "Cozy Luxury Apartment",
    location: "Maitama, Abuja",
    type: "3 Bedroom",
    guests: "6 Guests",
    price: "₦170,000",
    rating: "4.8",
    listedBy: "All-Apts",

    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",

    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    ],
  },
];
type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ApartmentDetails({ params }: Props) {
  const { id } = await params;

  const apartment = apartments.find((item) => item.id === id);

  if (!apartment) {
    return (
      <main className="min-h-screen bg-white p-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Apartment Not Found
        </h1>

        <p className="mt-3 text-gray-600">We could not find this apartment.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <ApartmentGallery images={apartment.images} name={apartment.name} />

        <div className="mt-8">
          <p className="text-sm text-gray-500">{apartment.location}</p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
            {apartment.name}
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Listed by{" "}
            <span className="font-medium text-gray-900">
              {apartment.listedBy}
            </span>
          </p>

          <div className="mt-4 flex gap-4 text-sm text-gray-600">
            <span>{apartment.type}</span>
            <span>•</span>
            <span>{apartment.guests}</span>
            <span>•</span>
            <span>★ {apartment.rating}</span>
          </div>

          <div className="mt-6">
            <span className="text-2xl font-bold text-gray-900">
              {apartment.price}
            </span>
            <span className="ml-1 text-gray-500">/ night</span>
          </div>
          <div className="mt-6">
            <button
              type="button"
              className="rounded-xl bg-black px-8 py-4 text-base font-semibold text-white transition hover:bg-gray-800"
            >
              Book Now
            </button>
          </div>
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">Amenities</h2>

            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 text-gray-700">
                <i className="ri-wifi-line text-xl"></i>
                <span>Wi-Fi</span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <i className="ri-tv-line text-xl"></i>
                <span>Smart TV</span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <i className="ri-snowy-line text-xl"></i>
                <span>Air Conditioning</span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <i className="ri-car-line text-xl"></i>
                <span>Free Parking</span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <i className="ri-home-gear-line text-xl"></i>
                <span>Fully Furnished</span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <i className="ri-shield-check-line text-xl"></i>
                <span>24/7 Security</span>
              </div>
              <div className="mt-10 border-t border-gray-200 pt-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Apartment Rules
                </h2>

                <div className="mt-5 space-y-4 text-gray-600">
                  <div className="flex items-center gap-3">
                    <i className="ri-time-line text-xl"></i>
                    <span>Check-in: 2:00 PM</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <i className="ri-time-line text-xl"></i>
                    <span>Check-out: 12:00 PM</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <i className="ri-forbid-2-line text-xl"></i>
                    <span>No parties or events</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <i className="ri-smoking-line text-xl"></i>
                    <span>No smoking indoors</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <i className="ri-volume-down-line text-xl"></i>
                    <span>Keep noise levels low</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
