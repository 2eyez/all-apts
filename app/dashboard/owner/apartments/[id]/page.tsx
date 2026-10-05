"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
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
}

export default function EditApartmentPage() {
  const params = useParams();
  const id = params.id as string;

  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function loadApartment() {
      try {
        const response = await fetch(`/api/apartments/${id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load apartment.");
        }

        setApartment(data.apartment);
      } catch (error) {
        console.error("LOAD APARTMENT ERROR:", error);

        setError(
          error instanceof Error ? error.message : "Failed to load apartment.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      loadApartment();
    }
  }, [id]);

  async function handleSave() {
    if (!apartment) {
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/apartments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price: apartment.price,
          discount: apartment.discount,
          images: apartment.images,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save changes.");
      }

      setApartment(data.apartment);
      setSuccess("Apartment pricing updated successfully.");
    } catch (error) {
      console.error("SAVE APARTMENT ERROR:", error);

      setError(
        error instanceof Error ? error.message : "Failed to save changes.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line animate-spin text-3xl text-blue-600" />

          <p className="mt-3 text-sm text-gray-500">Loading apartment...</p>
        </div>
      </div>
    );
  }

  if (error || !apartment) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <i className="ri-error-warning-line text-4xl text-red-500" />

          <h1 className="mt-4 text-xl font-bold text-gray-900">
            Unable to load apartment
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {error || "Apartment not found."}
          </p>

          <Link
            href="/dashboard/owner/apartments"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <i className="ri-arrow-left-line" />
            Back to Apartments
          </Link>
        </div>
      </div>
    );
  }

  const discountedPrice =
    apartment.discount > 0
      ? Math.round(
          apartment.price - (apartment.price * apartment.discount) / 100,
        )
      : apartment.price;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6">
        <Link
          href="/dashboard/owner/apartments"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <i className="ri-arrow-left-line" />
          Back to Apartments
        </Link>

        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
            Apartment Management
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 md:text-3xl">
            Edit Apartment
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Update your apartment details, pricing, amenities and house rules.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-950">
            Apartment Details
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            This page is connected to apartment #{apartment._id}.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Apartment Name
              </label>

              <input
                type="text"
                value={apartment.title}
                readOnly
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                value={apartment.description}
                readOnly
                rows={5}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Exact Address
                </label>

                <input
                  type="text"
                  value={apartment.address}
                  readOnly
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Area / Location
                </label>

                <input
                  type="text"
                  value={apartment.location}
                  readOnly
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  City
                </label>

                <input
                  type="text"
                  value={apartment.city}
                  readOnly
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Bedrooms
                </label>

                <input
                  type="text"
                  value={apartment.bedrooms}
                  readOnly
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Bathrooms
                </label>

                <input
                  type="text"
                  value={apartment.bathrooms}
                  readOnly
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-gray-950">
              Apartment Images
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add new images or remove existing images from this apartment.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
            {apartment.images.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
              >
                <img
                  src={image}
                  alt={`${apartment.title} image ${index + 1}`}
                  className="h-full w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() =>
                    setApartment((current) =>
                      current
                        ? {
                            ...current,
                            images: current.images.filter(
                              (_, imageIndex) => imageIndex !== index,
                            ),
                          }
                        : current,
                    )
                  }
                  className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white opacity-0 shadow-md transition group-hover:opacity-100 hover:bg-red-700"
                  title="Remove image"
                >
                  <i className="ri-delete-bin-line" />
                </button>
              </div>
            ))}

            <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-center transition hover:border-blue-400 hover:bg-blue-50">
              <i className="ri-image-add-line text-3xl text-blue-600" />

              <span className="mt-2 text-sm font-semibold text-gray-700">
                Add Images
              </span>

              <span className="mt-1 px-4 text-xs text-gray-400">
                Select images from your computer
              </span>

              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={async (event) => {
                  const files = Array.from(event.target.files || []);

                  if (files.length === 0) {
                    return;
                  }

                  setIsUploading(true);
                  setError("");
                  setSuccess("");

                  try {
                    const uploadedImages: string[] = [];

                    for (const file of files) {
                      const formData = new FormData();
                      formData.append("file", file);

                      const response = await fetch("/api/upload", {
                        method: "POST",
                        body: formData,
                      });

                      const data = await response.json();

                      if (!response.ok || !data.success) {
                        throw new Error(
                          data.message || `Failed to upload ${file.name}.`,
                        );
                      }

                      uploadedImages.push(data.url);
                    }

                    setApartment((current) =>
                      current
                        ? {
                            ...current,
                            images: [...current.images, ...uploadedImages],
                          }
                        : current,
                    );

                    setSuccess("Images uploaded successfully.");
                  } catch (error) {
                    console.error("UPLOAD EDIT IMAGES ERROR:", error);

                    setError(
                      error instanceof Error
                        ? error.message
                        : "Failed to upload images.",
                    );
                  } finally {
                    setIsUploading(false);
                    event.target.value = "";
                  }
                }}
              />
            </label>
          </div>

          {isUploading && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              <i className="ri-loader-4-line animate-spin text-lg" />
              Uploading images...
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-950">Pricing</h2>

            <p className="mt-1 text-sm text-gray-500">
              Update the normal nightly price and discount.
            </p>

            <div className="mt-5">
              <label
                htmlFor="price"
                className="text-sm font-medium text-gray-700"
              >
                Normal Nightly Price
              </label>

              <div className="mt-2 flex items-center rounded-xl border border-gray-200 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                <span className="pl-4 text-sm font-medium text-gray-500">
                  ₦
                </span>

                <input
                  id="price"
                  type="number"
                  min="0"
                  value={apartment.price}
                  onChange={(event) =>
                    setApartment((current) =>
                      current
                        ? {
                            ...current,
                            price: Number(event.target.value),
                          }
                        : current,
                    )
                  }
                  className="w-full rounded-xl px-2 py-3 text-sm font-medium text-gray-900 outline-none"
                />
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="discount"
                className="text-sm font-medium text-gray-700"
              >
                Discount
              </label>

              <div className="mt-2 flex items-center rounded-xl border border-gray-200 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                <input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={apartment.discount}
                  onChange={(event) =>
                    setApartment((current) =>
                      current
                        ? {
                            ...current,
                            discount: Number(event.target.value),
                          }
                        : current,
                    )
                  }
                  className="w-full rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none"
                />

                <span className="pr-4 text-sm font-medium text-gray-500">
                  %
                </span>
              </div>

              <p className="mt-2 text-xs text-gray-400">
                Enter a value between 0% and 100%.
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Current Guest Price</p>

              <p className="mt-1 text-xl font-bold text-gray-950">
                ₦{discountedPrice.toLocaleString()}
              </p>

              {apartment.discount > 0 && (
                <p className="mt-1 text-xs font-medium text-green-600">
                  {apartment.discount}% discount applied.
                </p>
              )}
            </div>

            <div className="mt-4">
              {success && (
                <div className="mb-3 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  <i className="ri-checkbox-circle-line text-lg" />
                  <p>{success}</p>
                </div>
              )}

              {error && (
                <div className="mb-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <i className="ri-error-warning-line text-lg" />
                  <p>{error}</p>
                </div>
              )}

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <i className="ri-loader-4-line animate-spin text-lg" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <i className="ri-save-line text-lg" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
