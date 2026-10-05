import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/app/lib/mongodb";
import User from "@/models/User";
import OwnerWebsite from "@/models/OwnerWebsite";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      name,
      companyName,
      email,
      phone,
      password,
      accountType,
    } = body;

    if (!name || !email || !password || !accountType) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email, password and account type are required.",
        },
        { status: 400 },
      );
    }

    if (accountType !== "guest" && accountType !== "company") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid account type.",
        },
        { status: 400 },
      );
    }

    if (accountType === "company" && !companyName) {
      return NextResponse.json(
        {
          success: false,
          message: "Company name is required for a company account.",
        },
        { status: 400 },
      );
    }

    if (String(password).length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters.",
        },
        { status: 400 },
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const role = accountType === "company" ? "owner" : "guest";

    // Only prevent the same email from registering the same account type twice.
    const existingUser = await User.findOne({
      email: normalizedEmail,
      role,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            accountType === "company"
              ? "A company account with this email already exists."
              : "A guest account with this email already exists.",
        },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(String(password), 12);

    const user = await User.create({
      name: String(name).trim(),

      companyName:
        accountType === "company"
          ? String(companyName).trim()
          : undefined,

      email: normalizedEmail,

      phone: phone ? String(phone).trim() : undefined,

      password: hashedPassword,

      role,

      isVerified: false,

      status: "active",
    });

    // Automatically create the owner's mini website.
    if (accountType === "company") {
      const websiteName = String(companyName).trim();

      const baseSlug = createSlug(websiteName);

      let slug = baseSlug;
      let counter = 1;

      // Make sure the website slug is unique.
      while (await OwnerWebsite.findOne({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      await OwnerWebsite.create({
        ownerId: user._id,
        name: websiteName,
        slug,
        email: normalizedEmail,
        phone: phone ? String(phone).trim() : undefined,
        isPublished: false,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        user: {
          id: user._id,
          name: user.name,
          companyName: user.companyName,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("REGISTER ERROR:", error);

    // MongoDB duplicate key error.
    if (error?.code === 11000) {
      const duplicateField = Object.keys(error?.keyPattern || {})[0];

      if (duplicateField === "companyName") {
        return NextResponse.json(
          {
            success: false,
            message: "This company name is already registered.",
          },
          { status: 409 },
        );
      }

      if (duplicateField === "email") {
        return NextResponse.json(
          {
            success: false,
            message: "This email and account type are already registered.",
          },
          { status: 409 },
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create account.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

