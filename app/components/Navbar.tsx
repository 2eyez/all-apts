"use client";

import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);

  return (
    <nav className="border-b border-gray-100 bg-white">
      {" "}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-8">
        {/* Logo */}
        <a href="/" className="text-2xl font-bold tracking-tight">
          All<span className="text-blue-600">Apts</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#"
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            Find a Shortlet
          </a>

          <a
            href="#"
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            List Your Shortlet
          </a>

          {/* Sign In Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSignInOpen(!signInOpen)}
              className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <i className="ri-user-3-line"></i>
              Sign In
            </button>

            {signInOpen && (
              <div className="absolute right-0 top-12 z-50 w-48 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
                <button
                  type="button"
                  className="block w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Sign in as Guest
                </button>

                <button
                  type="button"
                  className="block w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Sign in as Company
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>
      </div>
      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-6 py-5">
            <a
              href="#"
              onClick={() => setMenuOpen(false)}
              className="py-3 text-sm font-medium text-gray-700"
            >
              Find a Shortlet
            </a>

            <a
              href="#"
              onClick={() => setMenuOpen(false)}
              className="py-3 text-sm font-medium text-gray-700"
            >
              List Your Shortlet
            </a>

            {/* Mobile Sign In */}
            <div className="mt-3 border-t border-gray-100 pt-5">
              <button
                type="button"
                onClick={() => setSignInOpen(!signInOpen)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white"
              >
                <i className="ri-user-3-line"></i>
                Sign In
              </button>

              {signInOpen && (
                <div className="mt-3 flex flex-col gap-2">
                  <button
                    type="button"
                    className="rounded-lg bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700"
                  >
                    Sign in as Guest
                  </button>

                  <button
                    type="button"
                    className="rounded-lg bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700"
                  >
                    Sign in as Company
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
