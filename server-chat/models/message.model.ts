import mongoose from 'mongoose'

const Schema = new mongoose.Schema(
	{
		sender: {
			type: String,
			required: true,
			ref: 'user',
		},
		receiver: {
			type: String,
			required: true,
			ref: 'user',
		},
		message: {
			type: String,
			required: true,
		},
		timestamp: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
)

export const MessageModel = mongoose.model('message', Schema)
