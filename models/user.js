const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        lastname: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Email is invalid');
                }
            },
        },
        password: {
            type: String,
            required: true,
            minLength: 7,
            trim: true,
            validate(value) {
                if (value.toLowerCase().includes('password')) {
                    throw new Error("password musn't contain password");
                }
            },
        },
        infos: [
            {
                address: [
                    {
                        number: {
                            type: String,
                        },
                        street: {
                            type: String,
                        },
                        city: {
                            type: String,
                        },
                        phone: {
                            type: String,
                        },
                    },
                ],
                paiementCards: [
                    {
                        cardName: {
                            type: String,
                        },
                        cardNumber: {
                            type: Number,
                        },
                        cardTYpe: [
                            {
                                type: String,
                            },
                        ],
                        ExpDate: {
                            type: Date,
                        },
                    },
                ],
            },
        ],
        roles: {
            type: [
                {
                    type: String,
                    enum: ['user', 'vendor', 'admin'],
                },
            ],
            default: ['user'],
        },
        notifications: {
            type: Boolean,
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

//Generate auth token
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

//login in users
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Unable to log in');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
};

//Hash plain password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
