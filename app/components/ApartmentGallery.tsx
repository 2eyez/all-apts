"use client";

import { useEffect, useState } from "react";

type ApartmentGalleryProps = {
  apartmentId: string;
  images: string[];
  name: string;
};

export default function ApartmentGallery({
  apartmentId,
  images,
  name,
}: ApartmentGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function loadFavoriteStatus() {
      try {
        const response = await fetch("/api/favorites");
        const data = await response.json();

        if (response.ok && data.success && Array.isArray(data.favorites)) {
          const alreadyFavorite = data.favorites.some(
            (favorite: string | { _id?: string }) =>
              typeof favorite === "string"
                ? favorite === apartmentId
                : favorite?._id === apartmentId,
          );

          setIsFavorite(alreadyFavorite);
        }
      } catch (error) {
        console.error("LOAD FAVORITE STATUS ERROR:", error);
      }
    }

    loadFavoriteStatus();
  }, [apartmentId]);

  async function handleFavorite() {
    try {
      const method = isFavorite ? "DELETE" : "POST";

      console.log("SENDING FAVORITE REQUEST:", {
        method,
        apartmentId,
      });

      const response = await fetch("/api/favorites", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apartmentId,
        }),
      });

      const data = await response.json();

      console.log("FAVORITE RESPONSE:", data);

      if (!response.ok) {
        console.error("FAVORITE ERROR:", data.message);
        return;
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("FAVORITE REQUEST ERROR:", error);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleFavorite}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-105"
      >
        <i
          className={`${
            isFavorite
              ? "ri-heart-fill text-red-500"
              : "ri-heart-line text-gray-800"
          } text-xl`}
        ></i>
      </button>

      <img
        src={selectedImage}
        alt={name}
        className="h-[450px] w-full rounded-2xl object-cover"
      />

      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setSelectedImage(image)}
            className={`overflow-hidden rounded-xl ${
              selectedImage === image
                ? "ring-2 ring-black"
                : "ring-1 ring-gray-200"
            }`}
          >
            <img
              src={image}
              alt={`${name} ${index + 1}`}
              className="h-24 w-full object-cover transition hover:opacity-80"
            />
          </button>
        ))}
      </div>
    </div>
  );
}