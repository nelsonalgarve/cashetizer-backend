const express = require('express');
const User = require('../models/user');
const Auth = require('../middleware/auth');

const router = new express.Router();

//signup
router.post('/users', async (req, res) => {
	console.log(req.body);
	// const user = new User(req.body);
	const {
		username,
		firstname,
		lastname,
		email,
		password,
		number,
		street,
		city,
		zipCode,
		phone,
		cardName,
		cardNumber,
		cardType,
		expDate,
		// isVendor,
		notifications,
	} = req.body;
	console.log('username', username);
	const user = new User({
		username: username,
		firstname: firstname,
		lastname: lastname,
		email: email,
		password: password,
		infos: {
			address: [
				{
					number: number,
					street: street,
					city: city,
					phone: phone,
					zipCode: zipCode,
				},
			],
			paiementCards: [
				{
					cardName: cardName,
					cardNumber: cardNumber,
					cardType: cardType,
					expDate: expDate,
				},
			],
		},
		// isVendor: isVendor,
		notifications: notifications,
	});

	try {
		await user.save();
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (error) {
		res.status(400).send(error);
	}
});

//login

router.post('/users/login', async (req, res) => {
	try {
		console.log(req.body);
		const user = await User.findByCredentials(req.body.email, req.body.password);
		const token = await user.generateAuthToken();
		console.log(token);
		res.send({ user, token });
	} catch (error) {
		res.status(400).send(error);
	}
});

//logout
router.post('/users/logout', Auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token;
		});

		await req.user.save();
		res.send();
	} catch (error) {
		res.status(500).send();
	}
});

//Logout All
router.post('/users/logoutAll', Auth, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		res.send();
	} catch (error) {
		res.status(500).send();
	}
});
module.exports = router;
