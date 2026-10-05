"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const { data: session } = useSession();

  const isSignedIn = !!session?.user;

  return (
    <nav className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-8">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tight">
          All<span className="text-blue-600">Apts</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {isSignedIn ? (
            <>
              {/* Dashboard */}
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-blue-600"
              >
                <i className="ri-dashboard-line text-lg" />
                Dashboard
              </Link>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
                  aria-label="Account menu"
                  aria-expanded={accountOpen}
                >
                  <i className="ri-user-3-line text-xl" />
                </button>

                {accountOpen && (
                  <div className="absolute right-0 top-12 z-50 w-48 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
                    <div className="border-b border-gray-100 px-4 py-3">
                      <p className="text-xs text-gray-400">Signed in as</p>

                      <p className="mt-1 truncate text-sm font-medium text-gray-900">
                        {session.user?.name || "User"}
                      </p>
                    </div>

                    <Link
                      href="/dashboard/settings"
                      onClick={() => setAccountOpen(false)}
                      className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      <i className="ri-user-settings-line text-lg" />
                      Account
                    </Link>

                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      <i className="ri-logout-box-r-line text-lg" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Find a Shortlet */}
              <Link
                href="/apartments"
                className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
              >
                Find a Shortlet
              </Link>

              {/* List Your Shortlet */}
              <Link
                href="/auth/register?type=company"
                className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
              >
                List Your Shortlet
              </Link>

              {/* Sign In Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                  aria-expanded={accountOpen}
                >
                  <i className="ri-user-3-line" />
                  Sign In
                  <i
                    className={`ri-arrow-down-s-line transition-transform ${
                      accountOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {accountOpen && (
                  <div className="absolute right-0 top-12 z-50 w-60 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
                    <div className="px-4 py-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Sign in as
                      </p>
                    </div>

                    {/* Guest */}
                    <Link
                      href="/auth/signin?type=guest"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-gray-50"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <i className="ri-user-3-line text-xl" />
                      </span>

                      <span>
                        <span className="block text-sm font-semibold text-gray-900">
                          As a Guest
                        </span>
                        <span className="block text-xs text-gray-500">
                          Book and manage your stays
                        </span>
                      </span>
                    </Link>

                    {/* Company */}
                    <Link
                      href="/auth/signin?type=company"
                      onClick={() => setAccountOpen(false)}
                      className="mt-1 flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-gray-50"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <i className="ri-building-4-line text-xl" />
                      </span>

                      <span>
                        <span className="block text-sm font-semibold text-gray-900">
                          As a Company
                        </span>
                        <span className="block text-xs text-gray-500">
                          Manage your shortlets
                        </span>
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
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
            <i className="ri-close-line text-2xl" />
          ) : (
            <i className="ri-menu-line text-2xl" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-6 py-5">
            {isSignedIn ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 py-3 text-sm font-medium text-gray-700"
                >
                  <i className="ri-dashboard-line text-lg" />
                  Dashboard
                </Link>

                <div className="mt-3 border-t border-gray-100 pt-5">
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <i className="ri-user-settings-line text-lg" />
                    Account
                  </Link>

                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="mt-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <i className="ri-logout-box-r-line text-lg" />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/apartments"
                  onClick={() => setMenuOpen(false)}
                  className="py-3 text-sm font-medium text-gray-700"
                >
                  Find a Shortlet
                </Link>

                <Link
                  href="/auth/register?type=company"
                  onClick={() => setMenuOpen(false)}
                  className="py-3 text-sm font-medium text-gray-700"
                >
                  List Your Shortlet
                </Link>

                <div className="mt-3 border-t border-gray-100 pt-4">
                  <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Sign in as
                  </p>

                  <Link
                    href="/auth/signin?type=guest"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-gray-50"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <i className="ri-user-3-line text-xl" />
                    </span>

                    <span>
                      <span className="block text-sm font-semibold text-gray-900">
                        As a Guest
                      </span>
                      <span className="block text-xs text-gray-500">
                        Book and manage your stays
                      </span>
                    </span>
                  </Link>

                  <Link
                    href="/auth/signin?type=company"
                    onClick={() => setMenuOpen(false)}
                    className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-gray-50"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <i className="ri-building-4-line text-xl" />
                    </span>

                    <span>
                      <span className="block text-sm font-semibold text-gray-900">
                        As a Company
                      </span>
                      <span className="block text-xs text-gray-500">
                        Manage your shortlets
                      </span>
                    </span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}