const reviews = [
  {
    name: "Amaka O.",
    location: "Lagos, Nigeria",
    review:
      "The apartment was exactly as shown in the pictures. Booking was simple and the whole experience was smooth.",
  },
  {
    name: "Daniel K.",
    location: "Abuja, Nigeria",
    review:
      "I had a great stay. The apartment was clean, comfortable, and in a very good location.",
  },
  {
    name: "Sarah A.",
    location: "Port Harcourt, Nigeria",
    review:
      "Finding a shortlet on All-Apts was so easy. The host was responsive and everything went perfectly.",
  },
  {
    name: "Michael E.",
    location: "Calabar, Nigeria",
    review:
      "A very convenient way to find a quality shortlet. I will definitely use All-Apts again.",
  },
  {
    name: "Blessing C.",
    location: "Lagos, Nigeria",
    review:
      "The booking process was straightforward and the apartment was beautiful. Highly recommended.",
  },
];

export default function GuestReviews() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
      <div className="mb-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
          Guest Reviews
        </p>

        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
          What our guests say
        </h2>

        <p className="mt-3 max-w-2xl text-gray-600">
          Hear from guests who have enjoyed comfortable stays through All-Apts.
        </p>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
        {reviews.map((review) => (
          <article
            key={review.name}
            className="h-[260px] w-[350px] flex-shrink-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex gap-1 text-yellow-400">
              <i className="ri-star-fill"></i>
              <i className="ri-star-fill"></i>
              <i className="ri-star-fill"></i>
              <i className="ri-star-fill"></i>
              <i className="ri-star-fill"></i>
            </div>

            <p className="mb-6 leading-7 text-gray-600">“{review.review}”</p>

            <div>
              <p className="font-semibold text-gray-900">{review.name}</p>
              <p className="text-sm text-gray-500">{review.location}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
