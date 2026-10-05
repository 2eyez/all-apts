"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";

export default function SignInPage() {
  const [accountType, setAccountType] = useState<"guest" | "company">("guest");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      accountType,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email, password, or account type.");
      setLoading(false);
      return;
    }

    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          <div className="mb-8 text-center">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              All<span className="text-blue-600">Apts</span>
            </Link>

            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Sign in to your All-Apts account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Account Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Account Type
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAccountType("guest")}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                    accountType === "guest"
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  Guest
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType("company")}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                    accountType === "company"
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  Company
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-700"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  <i
                    className={
                      showPassword
                        ? "ri-eye-off-line text-lg"
                        : "ri-eye-line text-lg"
                    }
                  ></i>
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Create one
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

