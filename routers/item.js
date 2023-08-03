const express = require('express');
const Item = require('../models/item');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Auth = require('../middleware/auth');

const router = new express.Router();

//fetch all items
router.get('/items', async (req, res) => {
	try {
		const items = await Item.find({});
		res.status(200).send(items);
	} catch (error) {
		res.status(400).send(error);
	}
});

//fetch an item
router.get('/items/:id', async (req, res) => {
	try {
		console.log('token from front', req.header('Authorization'));
		if (
			!req.body.ownerId ||
			!req.body.name ||
			!req.body.description ||
			!req.body.category ||
			!req.body.prices ||
			!req.body.caution ||
			!req.body.isAvailable ||
			!req.body.localisation ||
			!req.body.periode.dateStart ||
			!req.body.periode.dateEnd
		) {
			return res.status(400).json({ message: 'Missing required fields' });
		}

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
	try {
		console.log(req.body);
		const token = req.header('Authorization').replace('Bearer ', '');

		// Verify the token and decode the payload
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Find the user based on the _id from the decoded payload
		const user = await User.findById(decoded._id);
		console.log('decodedId', decoded);
		console.log(user.username);
		console.log('USER_ID_FROM BACKEND', user._id);

		if (!user) {
			throw new Error('User not found');
		}

		const newItem = new Item({
			ownerId: user._id,
			name: req.body.name,
			description: req.body.description,
			category: req.body.category,
			prices: req.body.prices,
			caution: req.body.caution,
			isAvailable: req.body.isAvailable,
			localisation: req.body.localisation,
		});

		await newItem.save();
		res.status(201).send(newItem);
	} catch (error) {
		console.log('itemrouter');
		console.log({ error });
		res.status(400).send({ message: 'error' });
	}
});

// router.post('/items', async (req, res) => {
// 	try {
// 		console.log(req.body);
// 		const newItem = new Item({
// 			...req.body,
// 			owner: req.user._id,
// 		});

// 		await newItem.save();
// 		res.status(201).send(newItem);
// 	} catch (error) {
// 		console.log('itemrouter');
// 		console.log({ error });
// 		res.status(400).send({ message: 'error' });
// 	}
// });

//update an item

router.patch('/items/:id', Auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['name', 'description', 'category', 'price'];

	const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

	if (!isValidOperation) {
		return res.status(400).send({ error: 'invalid updates' });
	}

	try {
		const item = await Item.findOne({ _id: req.params.id });

		if (!item) {
			return res.status(404).send();
		}

		updates.forEach((update) => (item[update] = req.body[update]));
		await item.save();
		res.send(item);
	} catch (error) {
		res.status(400).send(error);
	}
});

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
