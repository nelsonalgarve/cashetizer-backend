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

router.get('/categories/welcome', async (req, res) => {
	try {
		const categoriesWithItemCount = await Category.aggregate([
			{
				$lookup: {
					from: 'items',
					localField: '_id',
					foreignField: 'category',
					as: 'items',
				},
			},
			{
				$project: {
					name: 1,
					itemCount: { $size: '$items' },
				},
			},
			{
				$sort: { itemCount: -1 },
			},
		]);

		res.json(categoriesWithItemCount);
	} catch (err) {
		res.status(500).json({ message: 'Internal Server Error' });
	}
});

module.exports = router;
