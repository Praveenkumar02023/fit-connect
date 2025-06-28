import mongoose, { Document, Schema, model, Types } from "mongoose";

export interface PaymentDocument extends Document {
  amount: number;
  purpose: "session" | "event" | "subscription";
  method: "upi" | "card" | "netbanking" | "wallet" | string;
  status: "success" | "pending" | "failed";
  transactionId: string;
  userId: Types.ObjectId;
  referenceId: Types.ObjectId;
}

const paymentSchema = new Schema<PaymentDocument>(
  {
    amount: { type: Number, required: true },

    purpose: {
      type: String,
      enum: ["Session", "Event", "Subscription"],
      required: true,
    },

    method: { type: String, required: true },

    status: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "pending",
      required: true,
    },

    transactionId: { type: String, required: true },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    referenceId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "purpose", // dynamic reference
    },
  },
  { timestamps: true }
);

export const paymentModel = model<PaymentDocument>("Payment", paymentSchema);
