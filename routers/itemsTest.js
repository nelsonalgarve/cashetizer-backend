const express = require('express');
const router = express.Router();
// const Item = require('../models/Item'); // Assuming your model is in this path

// Route: POST /items
router.post('/', async (req, res) => {
	try {
		const newItem = await Item.create(req.body);
		res.status(201).json(newItem);
	} catch (error) {
		res.status(500).json({ error: 'Failed to create the item.' });
	}
});

// Route: GET /items
router.get('/', async (req, res) => {
	try {
		const items = await Item.find();
		res.status(200).json(items);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch items.' });
	}
});

// Route: GET /items/:itemId
router.get('/:itemId', async (req, res) => {
	try {
		const item = await Item.findById(req.params.itemId);
		if (!item) {
			return res.status(404).json({ error: 'Item not found.' });
		}
		res.status(200).json(item);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch the item.' });
	}
});

// Route: PUT /items/:itemId
router.put('/:itemId', async (req, res) => {
	try {
		const updatedItem = await Item.findByIdAndUpdate(req.params.itemId, req.body, {
			new: true,
		});
		if (!updatedItem) {
			return res.status(404).json({ error: 'Item not found.' });
		}
		res.status(200).json(updatedItem);
	} catch (error) {
		res.status(500).json({ error: 'Failed to update the item.' });
	}
});

// Route: DELETE /items/:itemId
router.delete('/:itemId', async (req, res) => {
	try {
		const deletedItem = await Item.findByIdAndRemove(req.params.itemId);
		if (!deletedItem) {
			return res.status(404).json({ error: 'Item not found.' });
		}
		res.status(200).json(deletedItem);
	} catch (error) {
		res.status(500).json({ error: 'Failed to delete the item.' });
	}
});

module.exports = router;
