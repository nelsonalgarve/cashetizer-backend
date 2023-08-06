const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
