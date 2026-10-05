"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const amenityOptions = [
  { name: "WiFi", icon: "ri-wifi-line" },
  { name: "Air Conditioning", icon: "ri-temp-cold-line" },
  { name: "Parking", icon: "ri-parking-box-line" },
  { name: "Swimming Pool", icon: "ri-water-flash-line" },
  { name: "Generator", icon: "ri-flashlight-line" },
  { name: "24/7 Power", icon: "ri-lightbulb-line" },
  { name: "Smart TV", icon: "ri-tv-2-line" },
  { name: "Kitchen", icon: "ri-restaurant-2-line" },
  { name: "Washing Machine", icon: "ri-shirt-line" },
  { name: "Gym", icon: "ri-heart-pulse-line" },
  { name: "Security", icon: "ri-shield-check-line" },
  { name: "Balcony", icon: "ri-home-8-line" },
];

const ruleOptions = [
  { name: "No Smoking", icon: "ri-smoking-line" },
  { name: "No Parties", icon: "ri-goblet-line" },
  { name: "No Pets", icon: "ri-footprint-line" },
  { name: "No Loud Music", icon: "ri-volume-mute-line" },
  { name: "No Unregistered Guests", icon: "ri-user-forbid-line" },
  { name: "No Commercial Photography", icon: "ri-camera-off-line" },
];

export default function NewApartmentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  function toggleAmenity(name: string) {
    setSelectedAmenities((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name],
    );
  }

  function toggleRule(name: string) {
    setSelectedRules((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name],
    );
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);

    setSelectedImages(files);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  setIsSubmitting(true);
  setError("");

  if (selectedImages.length === 0) {
    setError("Please select at least one apartment image.");
    setIsSubmitting(false);
    return;
  }

  if (selectedAmenities.length === 0) {
    setError("Please select at least one amenity.");
    setIsSubmitting(false);
    return;
  }

  try {
    const formData = new FormData(event.currentTarget);

    const imageUrls: string[] = [];

    for (const image of selectedImages) {
      const uploadData = new FormData();
      uploadData.append("file", image);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadResult.success) {
        throw new Error(uploadResult.message || "Failed to upload image.");
      }

      imageUrls.push(uploadResult.url);
    }

    const apartmentResponse = await fetch("/api/apartments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description"),
        address: formData.get("address"),
        location: formData.get("location"),
        city: formData.get("city"),
        price: formData.get("price"),
        discount: formData.get("discount"),
        bedrooms: formData.get("bedrooms"),
        bathrooms: formData.get("bathrooms"),
        images: imageUrls,
        amenities: selectedAmenities,
        rules: selectedRules,
      }),
    });

    const apartmentResult = await apartmentResponse.json();

    if (!apartmentResponse.ok || !apartmentResult.success) {
      throw new Error(
        apartmentResult.message || "Failed to create apartment.",
      );
    }

    window.location.href = "/dashboard/owner/apartments";
  } catch (error) {
    console.error("CREATE APARTMENT ERROR:", error);

    setError(
      error instanceof Error
        ? error.message
        : "Something went wrong while creating the apartment.",
    );

    setIsSubmitting(false);
  }
}
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        {/* Header */}
        <section className="mb-7">
          <Link
            href="/dashboard/owner/apartments"
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition hover:text-blue-600"
          >
            <i className="ri-arrow-left-line" />
            Back to Apartments
          </Link>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
              Apartment Management
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 md:text-3xl">
              Add New Apartment
            </h1>

            <p className="mt-2 text-sm text-gray-500 md:text-base">
              Add a shortlet property to your All-Apts portfolio.
            </p>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <div className="border-b border-gray-100 pb-5">
              <h2 className="text-lg font-semibold text-gray-950">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Provide the main details guests will see about this property.
              </p>
            </div>

            <div className="mt-6 grid gap-5">
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Apartment Title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="e.g. Luxury 2 Bedroom Apartment in Lekki"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  required
                  rows={5}
                  placeholder="Describe the apartment, its features, location, and what guests can expect."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <div className="border-b border-gray-100 pb-5">
              <h2 className="text-lg font-semibold text-gray-950">
                Property Location
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add the exact address and location details of the apartment.
              </p>
            </div>

            <div className="mt-6 grid gap-5">
              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Exact Apartment Address
                </label>

                <div className="relative">
                  <i className="ri-map-pin-line absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400" />

                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    placeholder="e.g. 14 Admiralty Way, Lekki Phase 1"
                    className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Area / Neighborhood
                  </label>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    required
                    placeholder="e.g. Lekki Phase 1"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    placeholder="e.g. Lagos"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Property Details */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <div className="border-b border-gray-100 pb-5">
              <h2 className="text-lg font-semibold text-gray-950">
                Property Details
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Set the apartment&apos;s pricing and capacity.
              </p>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-4">
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Price per Night (₦)
                </label>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  required
                  placeholder="95000"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="discount"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Discount (%)
                </label>

                <input
                  id="discount"
                  name="discount"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue="0"
                  placeholder="0"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="bedrooms"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Bedrooms
                </label>

                <input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  min="1"
                  required
                  placeholder="2"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="bathrooms"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Bathrooms
                </label>

                <input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  min="1"
                  required
                  placeholder="2"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>

          {/* Images */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <div className="border-b border-gray-100 pb-5">
              <h2 className="text-lg font-semibold text-gray-950">
                Apartment Images
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Select photos of the apartment from your device.
              </p>
            </div>

            <div className="mt-6">
              <label
                htmlFor="images"
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center transition hover:border-blue-300 hover:bg-blue-50/40"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                  <i className="ri-image-add-line text-2xl" />
                </div>

                <p className="mt-4 text-sm font-semibold text-gray-900">
                  Select apartment photos
                </p>

                <p className="mt-1 text-xs text-gray-500">JPG, PNG or WEBP</p>

                <span className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                  Choose Images
                </span>
              </label>

              <input
                id="images"
                name="images"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />

              {selectedImages.length > 0 && (
                <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedImages.length} image
                      {selectedImages.length === 1 ? "" : "s"} selected
                    </p>

                    <i className="ri-checkbox-circle-line text-lg text-green-600" />
                  </div>

                  <div className="mt-3 space-y-2">
                    {selectedImages.map((file) => (
                      <div
                        key={`${file.name}-${file.lastModified}`}
                        className="flex items-center gap-3 rounded-lg bg-white px-3 py-2"
                      >
                        <i className="ri-image-line text-gray-400" />

                        <span className="min-w-0 flex-1 truncate text-xs text-gray-600">
                          {file.name}
                        </span>

                        <span className="text-[10px] text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Amenities */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <div className="border-b border-gray-100 pb-5">
              <h2 className="text-lg font-semibold text-gray-950">Amenities</h2>

              <p className="mt-1 text-sm text-gray-500">
                Select everything available at this apartment.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {amenityOptions.map((amenity) => {
                const selected = selectedAmenities.includes(amenity.name);

                return (
                  <button
                    key={amenity.name}
                    type="button"
                    onClick={() => toggleAmenity(amenity.name)}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                      selected
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <i
                      className={`${amenity.icon} text-lg ${
                        selected ? "text-blue-600" : "text-gray-400"
                      }`}
                    />

                    <span className="text-xs font-medium">{amenity.name}</span>

                    {selected && (
                      <i className="ri-checkbox-circle-fill ml-auto text-blue-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* House Rules */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <div className="border-b border-gray-100 pb-5">
              <h2 className="text-lg font-semibold text-gray-950">
                House Rules
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Select the rules guests must follow.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ruleOptions.map((rule) => {
                const selected = selectedRules.includes(rule.name);

                return (
                  <button
                    key={rule.name}
                    type="button"
                    onClick={() => toggleRule(rule.name)}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                      selected
                        ? "border-red-400 bg-red-50 text-red-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <i
                      className={`${rule.icon} text-lg ${
                        selected ? "text-red-500" : "text-gray-400"
                      }`}
                    />

                    <span className="text-xs font-medium">{rule.name}</span>

                    {selected && (
                      <i className="ri-checkbox-circle-fill ml-auto text-red-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Error / Status */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <div className="flex items-start gap-2">
                <i className="ri-error-warning-line mt-0.5 text-lg" />
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <section className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/dashboard/owner/apartments"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <i className="ri-loader-4-line animate-spin text-lg" />
                  Saving...
                </>
              ) : (
                <>
                  <i className="ri-save-line text-lg" />
                  Save Apartment
                </>
              )}
            </button>
          </section>
        </form>
      </div>
    </div>
  );
}
