// packages/nextjs/app/api/save/get.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";

const UserDataSchema = new mongoose.Schema({
  address: { type: String, required: true },
  data: { type: String, required: true },
});

const UserData = mongoose.models.UserData || mongoose.model("UserData", UserDataSchema);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  try {
    await mongoose.connect(process.env.MONGOURL ?? "");

    const userData = await UserData.find({ address });
    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
