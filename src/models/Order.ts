import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IOrder extends Document {
  restaurantId: mongoose.Schema.Types.ObjectId;
  ngoId: mongoose.Schema.Types.ObjectId;
  listings: Array<{
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    quantity: string;
    measurement: string;
    expiry: number;
    createdAt: Date;
  }>;
  status: 'accepted' | 'declined' | 'requested' | 'fulfilled' | 'cancelled';
  pendingStatus?: {
    status: 'fulfilled' | 'cancelled';
    requestedBy: mongoose.Types.ObjectId;
  };
  restReview?: string;
  ngoReview?: string;
}

const OrderSchema = new Schema<IOrder>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ngoId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    listings: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: 'Listing',
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
          required: true,
        },
        expiry: {
          type: Number,
          required: true,
        },
        createdAt: {
          type: Date,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ['accepted', 'declined', 'requested', 'fulfilled', 'cancelled'],
      default: 'requested',
    },
    pendingStatus: {
      type: {
        status: {
          type: String,
          enum: ['fulfilled', 'cancelled'],
        },
        requestedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    },
    restReview: {
      type: String,
    },
    ngoReview: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Order || model<IOrder>('Order', OrderSchema);