const express = require('express');
const mongoose = require('mongoose');
const Category = require('../models/category');
const Item = require('../models/item');

const router = new express.Router();

router.get('/category/autocomplete', async (req, res) => {
	const search = req.query.q;
	const results = await Category.find({ name: { $regex: search, $options: 'i' } });
	console.log(results);
	res.json(results.map((result) => result.name));
});

router.get('/categories', async (req, res) => {
	const categories = await Category.find();
	console.log(categories);
	res.json({ result: true, data: categories });
});

// GET CATEGORIES SORTED BY ITEM COUNT
router.get('/categories/sorted-by-items-count', async (req, res) => {
	try {
		const categoriesWithItemCount = await Category.aggregate([
			{
				$lookup: {
					from: 'items', // Name of the items collection in MongoDB
					localField: '_id',
					foreignField: 'category',
					as: 'items',
				},
			},
			{
				$addFields: {
					itemCount: { $size: '$items' },
				},
			},
			{
				$match: {
					itemCount: { $gt: 0 }, // Filter categories with item count greater than 0
				},
			},
			{
				$project: {
					items: 0, // Exclude the 'items' field from the result
				},
			},
			{
				$sort: { itemCount: -1 }, // Sort in descending order (highest count first)
			},
		]);

		res.json(categoriesWithItemCount);
	} catch (err) {
		// Handle error if any
		console.error('Error getting sorted categories:', err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// GET CATEGORIES SORTED BY ITEM COUNT

router.get('/categories/sorted-by-items', async (req, res) => {
	try {
		const categoriesWithItemCount = await Category.aggregate([
			{
				$lookup: {
					from: 'items', // Name of the items collection in MongoDB
					localField: '_id',
					foreignField: 'category',
					as: 'items',
				},
			},
			{
				$addFields: {
					itemCount: { $size: '$items' },
				},
			},
			{
				$match: {
					itemCount: { $gt: 0 }, // Filter categories with item count greater than 0
				},
			},
			{
				$project: {
					items: 0, // Exclude the 'items' field from the result
				},
			},
			{
				$sort: { itemCount: -1 }, // Sort in descending order (highest count first)
			},
		]);

		res.json(categoriesWithItemCount);
	} catch (err) {
		// Handle error if any
		console.error('Error getting sorted categories:', err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

module.exports = router;
