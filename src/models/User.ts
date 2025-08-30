import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  userType: "Restaurant" | "Charity/NGO";
  verificationCode: string;
  latitude: number;
  longitude: number;
  locationName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, enum: ["Restaurant", "Charity/NGO"], required: true },
    verificationCode: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    locationName: { type: String },
  },
  { timestamps: true } // automatically adds createdAt & updatedAt
);

export default models.User || model<IUser>("User", UserSchema);
