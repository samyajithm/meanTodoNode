const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator")

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String}
})

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Users', userSchema);