"use client";

import { useState } from "react";

type ApartmentGalleryProps = {
  images: string[];
  name: string;
};

export default function ApartmentGallery({
  images,
  name,
}: ApartmentGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsFavorite(!isFavorite)}
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

      {/* Main Image */}
      <img
        src={selectedImage}
        alt={name}
        className="h-[450px] w-full rounded-2xl object-cover"
      />

      {/* Thumbnails */}
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
