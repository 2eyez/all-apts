"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Apartment {
  _id: string;
  title: string;
  description: string;
  address: string;
  location: string;
  city: string;
  price: number;
  discount: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  amenities: string[];
  rules: string[];
  rating: number;
  listedBy: string;
  createdAt: string;
}

export default function OwnerApartmentsPage() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchApartments() {
      try {
        const response = await fetch("/api/apartments?scope=owner");

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load apartments.");
        }

        setApartments(data.apartments || []);
      } catch (error) {
        console.error("FETCH OWNER APARTMENTS ERROR:", error);

        setError(
          error instanceof Error ? error.message : "Failed to load apartments.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchApartments();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        {/* Header */}
        <section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
              Apartments
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 md:text-3xl">
              Your Apartments
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-gray-500 md:text-base">
              Manage the shortlet apartments you list and operate through
              All-Apts.
            </p>
          </div>

          <Link
            href="/dashboard/owner/apartments/new"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <i className="ri-add-line text-lg" />
            Add Apartment
          </Link>
        </section>

        {/* Summary */}
        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <i className="ri-building-4-line text-xl" />
            </div>

            <p className="mt-5 text-sm font-medium text-gray-500">
              Total Apartments
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-950">
              {isLoading ? "—" : apartments.length}
            </p>

            <p className="mt-2 text-xs text-gray-400">
              Properties in your portfolio
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <i className="ri-checkbox-circle-line text-xl" />
            </div>

            <p className="mt-5 text-sm font-medium text-gray-500">
              Active Listings
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-950">
              {isLoading ? "—" : apartments.length}
            </p>

            <p className="mt-2 text-xs text-gray-400">Currently available</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <i className="ri-eye-line text-xl" />
            </div>

            <p className="mt-5 text-sm font-medium text-gray-500">
              Total Bookings
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-950">—</p>

            <p className="mt-2 text-xs text-gray-400">Across your properties</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <i className="ri-money-naira-circle-line text-xl" />
            </div>

            <p className="mt-5 text-sm font-medium text-gray-500">Revenue</p>

            <p className="mt-1 text-2xl font-bold text-gray-950">—</p>

            <p className="mt-2 text-xs text-gray-400">Awaiting booking data</p>
          </div>
        </section>

        {/* Apartment list */}
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-950">
                Your Listings
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Apartments managed by your company.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
              >
                <i className="ri-filter-3-line mr-1" />
                Filter
              </button>

              <button
                type="button"
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
              >
                <i className="ri-search-line mr-1" />
                Search
              </button>
            </div>
          </div>

          {error && (
            <div className="m-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <div className="flex items-start gap-2">
                <i className="ri-error-warning-line mt-0.5 text-lg" />
                <p>{error}</p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <i className="ri-loader-4-line animate-spin text-lg" />
                Loading apartments...
              </div>
            </div>
          ) : apartments.length === 0 ? (
            <div className="flex min-h-[360px] items-center justify-center px-6 py-12">
              <div className="max-w-md text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <i className="ri-building-4-line text-3xl" />
                </div>

                <h3 className="mt-5 text-base font-semibold text-gray-900">
                  No apartments yet
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Add your first shortlet apartment to start managing your
                  properties, bookings, availability, and guests from your
                  dashboard.
                </p>

                <Link
                  href="/dashboard/owner/apartments/new"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <i className="ri-add-line text-lg" />
                  Add Your First Apartment
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 p-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {apartments.map((apartment) => (
                <article
                  key={apartment._id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    {apartment.images?.[0] ? (
                      <img
                        src={apartment.images[0]}
                        alt={apartment.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        <i className="ri-image-line text-4xl" />
                      </div>
                    )}

                    <div className="absolute left-3 top-3 rounded-lg bg-white/95 px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-sm">
                      {apartment.bedrooms} Bed
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="truncate text-base font-semibold text-gray-950">
                      {apartment.title}
                    </h3>

                    <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                      <i className="ri-map-pin-line text-blue-600" />
                      <span className="truncate">
                        {apartment.location}, {apartment.city}
                      </span>
                    </div>

                    <p className="mt-2 truncate text-xs text-gray-400">
                      {apartment.address}
                    </p>

                    <div className="mt-4 flex items-end justify-between border-t border-gray-100 pt-4">
                      <div>
                        <p className="text-xs text-gray-400">From</p>

                        {apartment.discount > 0 ? (
                          <>
                            <p className="text-sm text-gray-400 line-through">
                              ₦{apartment.price.toLocaleString()}
                            </p>

                            <p className="text-base font-bold text-gray-950">
                              ₦
                              {Math.round(
                                apartment.price -
                                  (apartment.price * apartment.discount) / 100,
                              ).toLocaleString()}
                            </p>

                            <p className="text-[11px] font-medium text-green-600">
                              {apartment.discount}% off · per night
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-base font-bold text-gray-950">
                              ₦{apartment.price.toLocaleString()}
                            </p>

                            <p className="text-[11px] text-gray-400">
                              per night
                            </p>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <i className="ri-star-fill text-yellow-500" />
                          {apartment.rating > 0 ? apartment.rating : "New"}
                        </div>

                        <Link
                          href={`/dashboard/owner/apartments/${apartment._id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <i className="ri-edit-line" />
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
