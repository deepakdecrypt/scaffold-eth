import { NextResponse } from "next/server";
import mongoose, { Document } from "mongoose";

interface IUserData extends Document {
  address: string;
  data: string;
}

const UserDataSchema = new mongoose.Schema<IUserData>({
  address: { type: String, required: true },
  data: { type: String, required: true },
});

const UserData = mongoose.models.UserData || mongoose.model<IUserData>("UserData", UserDataSchema);

export async function GET() {
  try {
    await mongoose.connect(process.env.MONGOURL ?? "");

    // Fetch all user data
    const userData = await UserData.find({});

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to fetch data" + process.env.MONGOURL }, { status: 500 });
  }
}
