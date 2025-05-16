const mongoose = require('mongoose')
const UserSchema  = mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    profilePic: { type: String, default: "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" }
});
module.exports = mongoose.model('user',UserSchema)