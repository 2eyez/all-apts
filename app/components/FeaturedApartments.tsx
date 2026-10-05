"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Apartment {
  _id: string;
  title: string;
  location: string;
  city: string;
  price: number;
  discount: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  rating: number;
  listedBy: string;
}

export default function FeaturedApartments() {
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

        setApartments(data.apartments || []);
      } catch (error) {
        console.error("FETCH APARTMENTS ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchApartments();
  }, []);

  return (
    <section className="mx-auto max-w-[1500px] px-4 pt-8 pb-2 md:px-6 md:pt-10 md:pb-4">
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

      {loading && (
        <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-96 animate-pulse rounded-2xl bg-gray-100"
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
                <h3 className="text-lg font-semibold text-gray-900">
                  {apartment.title}
                </h3>

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
                    {apartment.discount > 0 ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400 line-through">
                            ₦{apartment.price.toLocaleString()}
                          </span>

                          <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                            {apartment.discount}% OFF
                          </span>
                        </div>

                        <div className="mt-1">
                          <span className="text-xl font-bold text-gray-900">
                            ₦
                            {Math.round(
                              apartment.price -
                                (apartment.price * apartment.discount) / 100,
                            ).toLocaleString()}
                          </span>

                          <span className="ml-1 text-sm text-gray-500">
                            / night
                          </span>
                        </div>
                      </>
                    ) : (
                      <div>
                        <span className="text-xl font-bold text-gray-900">
                          ₦{apartment.price.toLocaleString()}
                        </span>

                        <span className="ml-1 text-sm text-gray-500">
                          / night
                        </span>
                      </div>
                    )}
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
        <div className="rounded-2xl border border-gray-200 py-12 text-center">
          <p className="text-gray-500">No shortlet apartments available yet.</p>
        </div>
      )}

      <button className="mt-6 w-full rounded-full border border-gray-300 py-3 text-sm font-semibold text-gray-900 md:hidden">
        View all apartments
      </button>
    </section>
  );
}
