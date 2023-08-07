const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

const cartSchema = new mongoose.Schema(
	{
		owner: {
			type: ObjectID,
			required: true,
			ref: 'User',
		},
		userId: {
			type: ObjectID,
			ref: 'User',
		},
		itemId: {
			type: ObjectID,
			ref: 'Item',
		},
		rentDateStart: {
			type: Date,
		},
		rentDateEnd: {
			type: Date,
		},
		transactionDate: {
			type: Date,
		},
		etatDesLieux: {
			type: ObjectID,
			ref: 'etatDesLieux',
		},
	},
	{
		timestamps: true,
	}
);

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
