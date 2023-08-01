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
		type: String,
		required: false,
	},
});

const Category = mongoose.model('categories', categorySchema);
module.exports = Category;
