import { notFound } from "next/navigation";
import ApartmentGallery from "../../components/ApartmentGallery";
import BookingWidget from "../../components/BookingWidget";
import { connectDB } from "@/app/lib/mongodb";
import Apartment from "@/models/Apartment";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ApartmentDetails({ params }: Props) {
  const { id } = await params;

  await connectDB();

  const apartment = await Apartment.findById(id).lean();

  if (!apartment) {
    notFound();
  }

  const guests = apartment.bedrooms * 2;

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <ApartmentGallery
          apartmentId={apartment._id.toString()}
          images={apartment.images}
          name={apartment.title}
        />

        <div className="mt-8">
          <p className="text-sm text-gray-500">
            {apartment.location}, {apartment.city}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
            {apartment.title}
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Listed by{" "}
            <span className="font-medium text-gray-900">
              {apartment.listedBy}
            </span>
          </p>

          <div className="mt-4 flex gap-4 text-sm text-gray-600">
            <span>
              {apartment.bedrooms} Bedroom
              {apartment.bedrooms !== 1 ? "s" : ""}
            </span>

            <span>•</span>

            <span>{guests} Guests</span>

            <span>•</span>

            <span>★ {apartment.rating}</span>
          </div>

          <div className="mt-6">
            {apartment.discount > 0 ? (
              <>
                <span className="mr-2 text-lg text-gray-400 line-through">
                  ₦{apartment.price.toLocaleString()}
                </span>

                <span className="text-2xl font-bold text-gray-900">
                  ₦
                  {Math.round(
                    apartment.price -
                      (apartment.price * apartment.discount) / 100,
                  ).toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-gray-900">
                ₦{apartment.price.toLocaleString()}
              </span>
            )}

            <span className="ml-1 text-gray-500">/ night</span>
          </div>

          <BookingWidget
            apartmentId={apartment._id.toString()}
            price={apartment.price}
            discount={apartment.discount}
            maxGuests={apartment.bedrooms * 2}
          />

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">Amenities</h2>

            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {apartment.amenities.map((amenity: string) => (
                <div
                  key={amenity}
                  className="flex items-center gap-3 text-gray-700"
                >
                  <i className="ri-checkbox-circle-line text-xl"></i>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Apartment Rules
            </h2>

            <div className="mt-5 space-y-4 text-gray-600">
              {apartment.rules.map((rule: string) => (
                <div key={rule} className="flex items-center gap-3">
                  <i className="ri-information-line text-xl"></i>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900">
              About this apartment
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-gray-600">
              {apartment.description}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
