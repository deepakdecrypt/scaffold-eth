import { NextResponse } from "next/server";
import mongoose from "mongoose";

const UserDataSchema = new mongoose.Schema({
  address: { type: String, required: true },
  data: { type: String, required: true },
});

const UserData = mongoose.models.UserData || mongoose.model("UserData", UserDataSchema);

export async function POST(req: Request) {
  try {
    const { address, data } = await req.json();

    await mongoose.connect(process.env.MONGOURL ?? "");

    const newUserData = new UserData({ address, data });
    await newUserData.save();

    return NextResponse.json({ message: "Data saved successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error saving data:", error);
    return NextResponse.json({ error: "Failed to save data" + process.env.MONGOURL }, { status: 500 });
  }
}
