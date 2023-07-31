const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	code: {
		type: String,
		required: false,
	},
	description: {
		type: String,
		required: true,
	},
	img: {
		type: string,
		required: false,
	},
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
