"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    const role = session.user.role;

    if (role === "owner") {
      router.replace("/dashboard/owner");
      return;
    }

    if (role === "admin") {
      router.replace("/dashboard/admin");
      return;
    }

    router.replace("/dashboard/guest");
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading dashboard...</p>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Please sign in
          </h1>

          <p className="mt-2 text-gray-500">
            You need to be signed in to access your dashboard.
          </p>

          <Link
            href="/auth/signin"
            className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <p className="text-gray-500">Redirecting to your dashboard...</p>
    </main>
  );
}