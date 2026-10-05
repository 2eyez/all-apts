"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface FavoriteApartment {
  _id: string;
  title: string;
  location: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  rating: number;
  listedBy: string;
}

export default function FavoritesPage() {
  const { data: session, status } = useSession();

  const [favorites, setFavorites] = useState<FavoriteApartment[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status !== "authenticated") {
      setLoadingFavorites(false);
      return;
    }

    async function loadFavorites() {
      try {
        setError("");

        const response = await fetch("/api/favorites");

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to load favorites.");
          return;
        }

        setFavorites(data.favorites || []);
      } catch (error) {
        console.error("LOAD FAVORITES ERROR:", error);
        setError("Failed to load favorites.");
      } finally {
        setLoadingFavorites(false);
      }
    }

    loadFavorites();
  }, [status]);

  async function removeFavorite(apartmentId: string) {
    try {
      const response = await fetch("/api/favorites", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apartmentId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to remove favorite.");
        return;
      }

      setFavorites((currentFavorites) =>
        currentFavorites.filter(
          (apartment) => apartment._id !== apartmentId,
        ),
      );
    } catch (error) {
      console.error("REMOVE FAVORITE ERROR:", error);
      setError("Failed to remove favorite.");
    }
  }

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading favorites...</p>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Please sign in
          </h1>

          <p className="mt-2 text-gray-500">
            You need to be signed in to view your favorites.
          </p>

          <Link
            href="/auth/signin"
            className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              GUEST DASHBOARD
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
              Favorites
            </h1>

            <p className="mt-3 text-gray-600">
              Your saved shortlet apartments will appear here.
            </p>
          </div>

          <Link
            href="/apartments"
            className="hidden rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 sm:inline-block"
          >
            Find a Shortlet
          </Link>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loadingFavorites ? (
          <div className="mt-10 rounded-2xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-gray-200">
            <p className="text-gray-500">Loading your favorites...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-gray-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
              <i className="ri-heart-line text-3xl"></i>
            </div>

            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              No favorites yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              When you find a shortlet apartment you love, save it to your
              favorites and it will appear here.
            </p>

            <Link
              href="/apartments"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Explore Shortlets
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((apartment) => (
              <article
                key={apartment._id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200"
              >
                <div className="relative">
                  <img
                    src={apartment.images?.[0] || "/hero.jpeg"}
                    alt={apartment.title}
                    className="h-56 w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeFavorite(apartment._id)}
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-105"
                    aria-label="Remove from favorites"
                  >
                    <i className="ri-heart-fill text-xl text-red-500"></i>
                  </button>
                </div>

                <div className="p-5">
                  <p className="text-sm text-gray-500">
                    {apartment.location}, {apartment.city}
                  </p>

                  <h2 className="mt-2 line-clamp-2 text-lg font-semibold text-gray-900">
                    {apartment.title}
                  </h2>

                  <div className="mt-3 flex items-center gap-3 text-sm text-gray-600">
                    <span>
                      {apartment.bedrooms} Bedroom
                      {apartment.bedrooms !== 1 ? "s" : ""}
                    </span>

                    <span>•</span>

                    <span>{apartment.bathrooms} Bathroom</span>

                    <span>•</span>

                    <span>★ {apartment.rating}</span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
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
                      className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}