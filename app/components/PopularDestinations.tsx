const PopularDestinations = () => {
  return (
    <>
      {/* Popular Destinations */} 
<section className="mx-auto max-w-[1500px] px-6 pt-16 pb-6 md:px-8 md:pt-20 md:pb-8">
  <div className="mb-10">
    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
      Explore
    </p>

    <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
      Popular Destinations
    </h2>

    <p className="mt-3 max-w-2xl text-gray-600">
      Explore popular locations and find the perfect shortlet for your next
      stay.
    </p>
  </div>

  <div className="flex gap-6 overflow-x-auto pb-4">
    {/* Abuja */}
    <div className="group relative h-72 min-w-[280px] flex-shrink-0 overflow-hidden rounded-2xl">
      <img
        src="/abj.jpeg"
        alt="Shortlet apartments in Abuja"
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 p-6">
        <h3 className="text-2xl font-bold text-white">Maitama</h3>
        <p className="mt-1 text-sm text-gray-200">
          Abuja,Nigeria
        </p>
      </div>
    </div>

    {/* Lagos */}
    <div className="group relative h-72 min-w-[280px] flex-shrink-0 overflow-hidden rounded-2xl">
      <img
        src="/lag.jpeg"
        alt="Shortlet apartments in Lagos"
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 p-6">
        <h3 className="text-2xl font-bold text-white">Victoria Island</h3>
        <p className="mt-1 text-sm text-gray-200">
          Lagos,Nigeria
        </p>
      </div>
    </div>

    {/* Port Harcourt */}
    <div className="group relative h-72 min-w-[280px] flex-shrink-0 overflow-hidden rounded-2xl">
      <img
        src="/ph.jpeg"
        alt="Shortlet apartments in Port Harcourt"
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 p-6">
        <h3 className="text-2xl font-bold text-white">Gwarimpa</h3>
        <p className="mt-1 text-sm text-gray-200">
          Abuja,Nigeria
        </p>
      </div>
    </div>

        {/* Benin City */}
    <div className="group relative h-72 min-w-[280px] flex-shrink-0 overflow-hidden rounded-2xl">
      <img
        src="/ph.jpeg"
        alt="Shortlet apartments in Benin City"
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 p-6">
        <h3 className="text-2xl font-bold text-white">Port Harcourt</h3>
        <p className="mt-1 text-sm text-gray-200">
          Rivers,Nigeria
        </p>
      </div>
    </div>

        {/* Ibadan*/}
   <div className="group relative h-72 min-w-[280px] flex-shrink-0 overflow-hidden rounded-2xl">
      <img
        src="/ph.jpeg"
        alt="Shortlet apartments in Ibadan"
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 p-6">
        <h3 className="text-2xl font-bold text-white">Ibadan</h3>
        <p className="mt-1 text-sm text-gray-200">
          Oyo,Nigeria
        </p>
      </div>
    </div>

    {/* Calabar */}
    <div className="group relative h-72 min-w-[280px] flex-shrink-0 overflow-hidden rounded-2xl">
      <img
        src="/cal.jpeg"
        alt="Shortlet apartments in Calabar"
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 p-6">
        <h3 className="text-2xl font-bold text-white">Calabar</h3>
        <p className="mt-1 text-sm text-gray-200">
          Cross River,Nigeria
        </p>
      </div>
    </div>
  </div>

      </section>
    </>
  );
};

export default PopularDestinations;