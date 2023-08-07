const express = require('express');
const mongoose = require('mongoose');
const Item = require('../models/item');
const Category = require('../models/category');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const Auth = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;
const uniqid = require('uniqid');
const fs = require('fs');
const uploadPhotosToCloudinary = require('../helpers/cloudinaryUpload');

const router = new express.Router();

//fetch all items
router.get('/items', async (req, res) => {
	console.log(req.params);
	try {
		const items = await Item.find({});
		res.status(200).send(items);
	} catch (error) {
		res.status(400).send(error);
	}
});

// Filter Items by keyword
router.get('/items/filter', async (req, res) => {
	try {
		const filterKeyword = req.query.keyword || ''; // Extract the filter keyword from the query parameter or set it to an empty string if not provided
		const filterOptions = {}; // You can add additional filter options if needed

		// Create a filter object based on your data model and the filter keyword
		if (filterKeyword) {
			filterOptions.$or = [
				{ name: { $regex: filterKeyword, $options: 'i' } }, // Case-insensitive search on the "name" field
				{ details: { $regex: filterKeyword, $options: 'i' } }, // Case-insensitive search on the "details" field
			];
		}

		// Use the filterOptions object to query the database
		const items = await Item.find(filterOptions);

		res.status(200).send(items);
	} catch (error) {
		res.status(400).send(error);
	}
});

//fetch an item
router.get('/items/:id', async (req, res) => {
	try {
		console.log('token from front', req.header('Authorization'));

		const item = await Item.findOne({ _id: req.params.id }).populate('owner');
		if (!item) {
			res.status(404).send({ error: 'Item not found' });
		}
		res.status(200).send(item);
	} catch (error) {
		res.status(400).send(error);
	}
});

// POSTER UN ITEM

router.post('/items', async (req, res) => {
	console.log(req.body);
	try {
		if (!req.body.name) {
			return res.status(400).json({ message: 'Missing required fields' });
		}

		const token = req.header('Authorization').replace('Bearer ', '');
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded._id);

		if (!user) {
			throw new Error('User not found');
		}

		// Upload photos to Cloudinary
		const photoUrls = await uploadPhotosToCloudinary(req.body.photos);

		const newItem = new Item({
			ownerId: user._id,
			name: req.body.name,
			description: {
				details: req.body.description,
				etat: req.body.etat,
				photos: photoUrls, // Assigning the Cloudinary URLs here
				videos: [req.body.videos],
			},
			category: req.body.category,
			prices: {
				perDay: req.body.prices,
			},
			caution: req.body.caution,
			localisation: {
				latitude: req.body.localisation.latitude,
				longitude: req.body.localisation.longitude,
			},
			periodes: req.body.periodes,
		});

		await newItem.save();
		res.status(201).send(newItem);
	} catch (error) {
		console.log('itemrouter');
		console.log({ error });
		res.status(400).send({ message: 'error' });
	}
});

// FETCH ITEMS BY CATEGORY ID -------------------------------------------------------------------------------
router.get('/items/category/:categoryId', async (req, res) => {
	const categoryId = req.params.categoryId;

	try {
		const items = await Item.find({ category: categoryId }).populate('category');
		res.json(items);
	} catch (err) {
		console.error('Error fetching items by category:', err);
		res.status(500).json({ message: 'Error fetching items by category' });
	}
});

// FETCH ITEMS BY CATEGORY NAME ----------------------------------------------------------------
router.get('/items/categoryname/:categoryName', async (req, res) => {
	const categoryName = req.params.categoryName;
	const { startDate, endDate } = req.query;

	try {
		const decodedCategoryName = decodeURIComponent(categoryName);
		const category = await Category.findOne({ name: decodedCategoryName });

		if (!category) {
			return res.status(404).json({ message: 'Category not found' });
		}

		let itemsQuery = Item.find({ category: category._id }).populate('category');

		if (startDate && endDate) {
			itemsQuery = itemsQuery.where('periodes').elemMatch({
				start: { $lte: new Date(endDate) },
				end: { $gte: new Date(startDate) },
			});
		}

		const items = await itemsQuery.exec();
		res.json(items);
	} catch (err) {
		console.error('Error fetching items by category name:', err);
		res.status(500).json({ message: 'Error fetching items by category name', error: err.message });
	}
});

// UPDATE AN ITEM -------------------------------------------------------------------------------
router.get('/items/categoryname/:categoryName', async (req, res) => {
	const categoryName = req.params.categoryName;
	const { startDate, endDate } = req.query;

	try {
		// Decode the encoded category name before using it in the query
		const decodedCategoryName = decodeURIComponent(categoryName);

		// Find the category with the given name
		const category = await Category.findOne({ name: decodedCategoryName });

		if (!category) {
			return res.status(404).json({ message: 'Category not found' });
		}

		// Build the query dynamically based on the parameters
		let query = { category: category._id };

		if (startDate || endDate) {
			query.date = {};
			if (startDate) {
				query.date.$gte = new Date(startDate);
			}
			if (endDate) {
				query.date.$lte = new Date(endDate);
			}
		}

		// Fetch items by category ID and date range
		const items = await Item.find(query).populate('category');
		res.json(items);
	} catch (err) {
		console.error('Error fetching items by category name:', err);
		res.status(500).json({ message: 'Error fetching items by category name', error: err.message });
	}
});

// router.patch('/items/:id', Auth, async (req, res) => {
// 	const updates = Object.keys(req.body);
// 	const allowedUpdates = ['name', 'description', 'category', 'price'];

// 	const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

// 	if (!isValidOperation) {
// 		return res.status(400).send({ error: 'invalid updates' });
// 	}

// 	try {
// 		const item = await Item.findOne({ _id: req.params.id });

// 		if (!item) {
// 			return res.status(404).send();
// 		}

// 		updates.forEach((update) => (item[update] = req.body[update]));
// 		await item.save();
// 		res.send(item);
// 	} catch (error) {
// 		res.status(400).send(error);
// 	}
// });

//delete item
router.delete('/items/:id', Auth, async (req, res) => {
	try {
		const deletedItem = await Item.findOneAndDelete({ _id: req.params.id });
		if (!deletedItem) {
			res.status(404).send({ error: 'Item not found' });
		}
		res.send(deletedItem);
	} catch (error) {
		res.status(400).send(error);
	}
});

// categories autocomplete

router.get('/items/autocomplete', async (req, res) => {
	const search = req.query.q;
	const results = await Category.find({ name: { $regex: search, $options: 'i' } });
	res.json(results.map((result) => result.name));
});

module.exports = router;
