import { Document, Schema } from 'mongoose'

// Interface for TypeScript support
export interface IAgent extends Document {
	adjectives: string[]
	profileVerification: boolean
	UserId: string
	age: number
	gender: string
	occupation: string
	location: string
	profileImageQuery: string
	agentId: string
	bio: string[]
	fileName: string
	knowledge: string[]
	lore: string[]
	messageExamples: {
		agentRelytoMessage: string
		userMessage: string
	}[]
	name: string
	postExamples: {
		content: string
		user: string
	}[]
	settings: {
		voice: {
			model: string
		}
	}
	style: {
		all: string[]
		chat: string[]
		post: string[]
	}
	topics: string[]
}

// Agent Schema
export const agentSchema = new Schema<IAgent>({
	adjectives: { type: [String], required: true },
	profileVerification: { type: Boolean, required: true },
	age: { type: Number, required: true },
	gender: { type: String, required: true },
	profileImageQuery: { type: String, required: true },
	occupation: { type: String, required: true },
	location: { type: String, required: true },
	UserId: { type: String, required: true, unique: true },
	agentId: { type: String, required: true, unique: true },
	bio: { type: [String], required: true },
	fileName: { type: String, required: true },
	knowledge: { type: [String], required: true },
	lore: { type: [String], required: true },
	messageExamples: [
		{
			agentRelytoMessage: { type: String, required: true },
			userMessage: { type: String, required: true },
		},
	],
	name: { type: String, required: true },
	postExamples: [
		{
			content: { type: String, required: true },
			user: { type: String, required: true },
		},
	],
	settings: {
		voice: {
			model: { type: String, required: true },
		},
	},
	style: {
		all: { type: [String], required: true },
		chat: { type: [String], required: true },
		post: { type: [String], required: true },
	},
	topics: { type: [String], required: true },
})

// The model is dynamically created in the database connection setup file (e.g., in db.ts file)
