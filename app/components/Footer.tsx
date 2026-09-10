
export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold">
              All<span className="text-blue-400">-Apts</span>
            </h2>

            <p className="mt-4 max-w-xs text-sm leading-6 text-gray-400">
              Find comfortable shortlet apartments for your next stay.
              Discover, choose, and book with ease.
            </p>

            <div className="mt-5 flex gap-4">
              <a href="#" className="text-gray-400 transition hover:text-white">
                <i className="ri-facebook-fill text-xl"></i>
              </a>

              <a href="#" className="text-gray-400 transition hover:text-white">
                <i className="ri-instagram-line text-xl"></i>
              </a>

              <a href="#" className="text-gray-400 transition hover:text-white">
                <i className="ri-twitter-x-line text-xl"></i>
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-4 font-semibold">Explore</h3>

            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="#" className="transition hover:text-white">
                  Find a Shortlet
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Popular Destinations
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Explore by Type
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Hosts */}
          <div>
            <h3 className="mb-4 font-semibold">For Hosts</h3>

            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="#" className="transition hover:text-white">
                  List Your Shortlet
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Host Dashboard
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Host Resources
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 font-semibold">Company</h3>

            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="#" className="transition hover:text-white">
                  About All-Apts
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Contact Us
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Help Center
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Terms & Privacy
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col gap-3 border-t border-gray-800 pt-6 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} All-Apts. All rights reserved.
          </p>

          <p>
            Shortlets made simple.
          </p>
        </div>
      </div>
    </footer>
  );
}

