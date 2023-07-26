const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdBy: {
        type: ObjectID,
        ref: 'User',
        required: true,
    },
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
