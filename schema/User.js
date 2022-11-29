const mongoose = require("mongoose")
//Define Schema
let userSchema = {
    name: String,
    phone: Number,
    email: String
}

//Create Model
 const User = mongoose.model('User', userSchema);

 module.exports = User;
