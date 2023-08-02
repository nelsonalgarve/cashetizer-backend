const express = require('express');
const mongoose = require('mongoose');
const Category = require('../models/category');

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

module.exports = router;
