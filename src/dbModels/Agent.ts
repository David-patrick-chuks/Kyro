import mongoose, { Document, Schema, Model } from "mongoose";

// Interface for TypeScript support
export interface IAgent extends Document {
	YoutubeData: string,
	AudioData: string,
	WebsiteData: string,
	TextData: string
}

// Agent Schema
export const agentSchema = new Schema<IAgent>({
	AudioData: { type: String },
	WebsiteData: { type: String },
	TextData: { type: String },
	YoutubeData: { type: String },
})


// Create the Tweet model
export const Agent: Model<IAgent> = mongoose.model<IAgent>("Agent", agentSchema);