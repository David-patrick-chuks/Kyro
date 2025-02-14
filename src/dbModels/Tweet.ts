import mongoose, { Document, Schema, Model } from "mongoose";

// Define TypeScript interface for the Tweet document
export interface ITweet extends Document {
  tweetContent: string;
  imageUrl: string;
  timeTweeted: Date;
}

// Define the Mongoose schema
const tweetSchema: Schema<ITweet> = new Schema({
  tweetContent: { type: String, required: true },
  imageUrl: { type: String, required: true },
  timeTweeted: { type: Date, default: Date.now },
});

// Create the Tweet model
export const Tweet: Model<ITweet> = mongoose.model<ITweet>("Tweet", tweetSchema);
