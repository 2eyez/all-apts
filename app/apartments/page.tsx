"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Apartment {
  _id: string;
  title: string;
  description: string;
  location: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  amenities: string[];
  rules: string[];
  rating: number;
  listedBy: string;
}

function ApartmentsContent() {
  const searchParams = useSearchParams();

  const location = searchParams.get("location") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = searchParams.get("guests") || "";

  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApartments() {
      try {
        const response = await fetch("/api/apartments");

        if (!response.ok) {
          throw new Error("Failed to fetch apartments");
        }

        const data = await response.json();

        let filteredApartments = data.apartments || [];

        if (location) {
          filteredApartments = filteredApartments.filter(
            (apartment: Apartment) =>
              apartment.city.toLowerCase().includes(location.toLowerCase()) ||
              apartment.location
                .toLowerCase()
                .includes(location.toLowerCase()),
          );
        }

        if (guests) {
          filteredApartments = filteredApartments.filter(
            (apartment: Apartment) =>
              apartment.bedrooms * 2 >= Number(guests),
          );
        }

        setApartments(filteredApartments);
      } catch (error) {
        console.error("FETCH APARTMENTS ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchApartments();
  }, [location, guests]);

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-[1500px] px-4 py-10 md:px-6">
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-500">
            {location ? "SEARCH RESULTS" : "ALL SHORTLETS"}
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            {location
              ? `Shortlets in ${location}`
              : "Find your perfect shortlet"}
          </h1>

          <p className="mt-3 text-gray-600">
            {location
              ? `${apartments.length} shortlet${
                  apartments.length === 1 ? "" : "s"
                } available for ${guests || "your"} guest${
                  Number(guests) === 1 ? "" : "s"
                }.`
              : "Explore comfortable shortlet apartments available on All-Apts."}
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-96 animate-pulse rounded-2xl bg-gray-200"
              />
            ))}
          </div>
        )}

        {!loading && apartments.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
            {apartments.map((apartment) => (
              <article
                key={apartment._id}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={apartment.images?.[0] || "/hero.jpeg"}
                    alt={apartment.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-900 shadow-sm">
                    ★ {apartment.rating}
                  </div>
                </div>

                <div className="p-5">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {apartment.title}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {apartment.location}, {apartment.city}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Listed by {apartment.listedBy}
                  </p>

                  <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
                    <span>
                      {apartment.bedrooms} Bedroom
                      {apartment.bedrooms !== 1 ? "s" : ""}
                    </span>

                    <span className="text-gray-300">•</span>

                    <span>{apartment.bedrooms * 2} Guests</span>
                  </div>

                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <span className="text-xl font-bold text-gray-900">
                        ₦{apartment.price.toLocaleString()}
                      </span>

                      <span className="ml-1 text-sm text-gray-500">
                        / night
                      </span>
                    </div>

                    <Link
                      href={`/apartments/${apartment._id}`}
                      className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && apartments.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white py-12 text-center">
            <p className="text-gray-500">
              No shortlet apartments available yet.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default function ApartmentsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50">
          <section className="mx-auto max-w-[1500px] px-4 py-10 md:px-6">
            <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-96 animate-pulse rounded-2xl bg-gray-200"
                />
              ))}
            </div>
          </section>
        </main>
      }
    >
      <ApartmentsContent />
    </Suspense>
  );
}