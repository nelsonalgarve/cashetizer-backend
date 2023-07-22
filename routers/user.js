const express = require('express');
const User = require('../models/user');
const Auth = require('../middleware/auth');

const router = new express.Router();

//signup
router.post('/users', async (req, res) => {
    // const user = new User(req.body);
    const { name, email, password, number, street, city, phone, cardName, cardNumber, cardType, expDate, isVendor, notifications } = req.body;
    const user = new User({
        name: name,
        email: email,
        password: password,
        infos: {
            address: [
                {
                    number: number,
                    street: street,
                    city: city,
                    phone: phone,
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
        isVendor: isVendor,
        notifications: notifications,
    });
    // user.infos.address.street = "13 rue du maine";
    console.log('post user :', user);
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
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

//logout
router.post('/users/logout', Auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
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
