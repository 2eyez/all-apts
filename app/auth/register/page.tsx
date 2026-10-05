"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [accountType, setAccountType] = useState<"guest" | "company">(
    "guest"
  );

  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountType,
          companyName: formData.companyName,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        setLoading(false);
        return;
      }

      setSuccess("Account created successfully. Redirecting...");

      setTimeout(() => {
        router.push("/auth/signin");
      }, 1200);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="text-3xl font-bold text-black">
              All<span className="text-blue-600">Apts</span>
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900">
            Create your All-Apts account
          </h1>

          <p className="text-gray-500 mt-2">
            Join All-Apts and get started today.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          {/* Account Type */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Register as
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAccountType("guest")}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  accountType === "guest"
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                Guest
              </button>

              <button
                type="button"
                onClick={() => setAccountType("company")}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  accountType === "company"
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                Company
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Company Name */}
            {accountType === "company" && (
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Company name
                </label>

                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter your company name"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            )}

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                minLength={8}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />

              <p className="text-xs text-gray-400 mt-2">
                Password must be at least 8 characters.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600">
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Sign In */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          By creating an account, you agree to use All-Apts responsibly.
        </p>
      </div>
    </main>
  );
}

