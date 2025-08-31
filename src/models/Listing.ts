import mongoose, { Schema, Document, models, model } from 'mongoose';

// Interface for Listing document
export interface IListing extends Document {
  restaurantId: mongoose.Schema.Types.ObjectId;
  name: string;
  quantity: string; // Changed to a string
  measurement: 'kg' | 'g' | 'ml' | 'l' | 'units' | 'custom' | string;
  expiry: number;
  view: 'blocked' | 'not blocked';
  status: 'available' | 'claimed' | 'completed';
  claimedBy?: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

const ListingSchema = new Schema<IListing>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    measurement: {
      type: String,
      enum: ['kg', 'g', 'ml', 'l', 'units', 'custom'],
      required: true,
    },
    expiry: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4],
    },
    status: {
      type: String,
      enum: ['available', 'claimed', 'completed'],
      default: 'available',
    },
    claimedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    expiresAt: {
      type: Date,
      default: function(this: IListing) {
        return new Date(Date.now() + this.expiry * 60 * 60 * 1000);
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// TTL index on expiresAt field
ListingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default models.Listing || model<IListing>('Listing', ListingSchema);