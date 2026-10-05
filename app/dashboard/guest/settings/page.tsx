"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface AccountUser {
  name: string;
  email: string;
  phone?: string;
}

export default function SettingsPage() {
  const { data: session, status } = useSession();

  const [user, setUser] = useState<AccountUser | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [loadingAccount, setLoadingAccount] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordStep, setPasswordStep] = useState<"current" | "new">(
    "current",
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [checkingPassword, setCheckingPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    async function loadAccount() {
      try {
        setLoadingAccount(true);
        setError("");

        const response = await fetch("/api/account/settings");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load account");
        }

        setUser(data.user);
        setName(data.user.name || "");
        setPhone(data.user.phone || "");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load account settings",
        );
      } finally {
        setLoadingAccount(false);
      }
    }

    loadAccount();
  }, [status]);

  async function handleSaveChanges() {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch("/api/account/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save changes");
      }

      setUser(data.user);
      setName(data.user.name || "");
      setPhone(data.user.phone || "");

      setMessage("Your account information has been updated.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save changes",
      );
    } finally {
      setSaving(false);
    }
  }

  async function verifyCurrentPassword() {
    try {
      setCheckingPassword(true);
      setError("");
      setMessage("");

      if (!currentPassword) {
        setError("Please enter your current password.");
        return;
      }

      const response = await fetch("/api/account/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Incorrect password");
      }

      setPasswordStep("new");
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Incorrect password",
      );
    } finally {
      setCheckingPassword(false);
    }
  }

  async function handleChangePassword() {
    try {
      setChangingPassword(true);
      setMessage("");
      setError("");

      if (!newPassword || !confirmPassword) {
        setError("Please enter and confirm your new password.");
        return;
      }

      if (newPassword.length < 8) {
        setError("New password must be at least 8 characters.");
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("New passwords do not match.");
        return;
      }

      const response = await fetch("/api/account/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      setPasswordStep("current");
      setShowPasswordForm(false);

      setMessage("Your password has been changed successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to change password",
      );
    } finally {
      setChangingPassword(false);
    }
  }

  function closePasswordForm() {
    setShowPasswordForm(false);
    setPasswordStep("current");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);

    setError("");
  }

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading account...</p>
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
            You need to be signed in to manage your account.
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

  if (loadingAccount) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading your account...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <div>
          <p className="text-sm font-medium text-blue-600">
            GUEST DASHBOARD
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            Account Settings
          </h1>

          <p className="mt-3 text-gray-600">
            Manage your personal information and account.
          </p>
        </div>

        {message && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Personal Information
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

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
                value={user?.email || session.user.email || ""}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none"
                disabled
              />

              <p className="mt-2 text-xs text-gray-400">
                Your email address cannot be changed here.
              </p>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>

              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Enter your phone number"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="button"
              onClick={handleSaveChanges}
              disabled={saving}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Security
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Change your password and keep your account secure.
          </p>

          {!showPasswordForm ? (
            <button
              type="button"
              onClick={() => {
                setShowPasswordForm(true);
                setPasswordStep("current");
                setMessage("");
                setError("");
              }}
              className="mt-5 rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Change Password
            </button>
          ) : (
            <div className="mt-6">
              {passwordStep === "current" ? (
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Current Password
                    </label>

                    <div className="relative">
                      <input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(event) =>
                          setCurrentPassword(event.target.value)
                        }
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        aria-label={
                          showCurrentPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-700"
                      >
                        <i
                          className={
                            showCurrentPassword
                              ? "ri-eye-off-line text-lg"
                              : "ri-eye-line text-lg"
                          }
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={verifyCurrentPassword}
                      disabled={checkingPassword}
                      className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {checkingPassword ? "Checking..." : "Continue"}
                    </button>

                    <button
                      type="button"
                      onClick={closePasswordForm}
                      className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <p className="mb-5 text-sm text-gray-500">
                      Current password verified. Enter your new password
                      below.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      New Password
                    </label>

                    <div className="relative">
                      <input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(event) =>
                          setNewPassword(event.target.value)
                        }
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword(!showNewPassword)
                        }
                        aria-label={
                          showNewPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-700"
                      >
                        <i
                          className={
                            showNewPassword
                              ? "ri-eye-off-line text-lg"
                              : "ri-eye-line text-lg"
                          }
                        />
                      </button>
                    </div>

                    <p className="mt-2 text-xs text-gray-400">
                      Password must be at least 8 characters.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Confirm New Password
                    </label>

                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={
                          showConfirmPassword ? "text" : "password"
                        }
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-700"
                      >
                        <i
                          className={
                            showConfirmPassword
                              ? "ri-eye-off-line text-lg"
                              : "ri-eye-line text-lg"
                          }
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleChangePassword}
                      disabled={changingPassword}
                      className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {changingPassword
                        ? "Changing..."
                        : "Update Password"}
                    </button>

                    <button
                      type="button"
                      onClick={closePasswordForm}
                      className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

