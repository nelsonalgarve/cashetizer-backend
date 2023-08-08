const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
const { Schema } = mongoose;

const periodeSchema = new mongoose.Schema({
	start: Date,
	end: Date,
});

const itemSchema = new mongoose.Schema(
	{
		ownerId: {
			type: ObjectID,
			// required: true,
			ref: 'users',
		},
		name: {
			type: String,
			// required: true,
			trim: true,
		},
		description: {
			dimensions: {
				hauteur: {
					type: Number,
					// required: true,
					trim: true,
				},
				largeur: {
					type: Number,
					// required: true,
					trim: true,
				},
				poids: {
					type: Number,
					// required: true,
					trim: true,
				},
			},
			etat: {
				type: String,
				// required: true,
				trim: true,
			},
			details: {
				type: String,
				required: true,
			},
			photos: [
				{
					type: String,
					// required: true,
				},
			],
			videos: [
				{
					type: String,
					// required: true,
				},
			],
		},
		category: {
			type: ObjectID,
			// required: true,
			ref: 'Category',
		},
		prices: {
			perHour: {
				type: Number,
				currency: 'EUR',
				trim: true,
			},
			perDay: {
				type: Number,
				currency: 'EUR',
				trim: true,
			},
			perWeek: {
				type: Number,
				currency: 'EUR',
				trim: true,
			},
			perMonth: {
				type: Number,
				currency: 'EUR',
				trim: true,
			},
		},
		caution: {
			type: Number,
			currency: 'EUR',
			trim: true,
		},
		isAvailable: {
			type: Boolean,
			default: true,
		},
		localisation: {
			latitude: {
				type: String,
				trim: true,
			},

			longitude: {
				type: String,
				trim: true,
			},
		},
		livraison: {
			type: String,
		},
		periodes: [periodeSchema],
	},
	{
		timestamps: true,
	}
);

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
