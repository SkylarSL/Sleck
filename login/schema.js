var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/mongoTest", { useNewUrlParser: true });
mongoose.Promise = global.Promise;

var userSchema = new mongoose.Schema({
    name: String, 
    email: String, 
});

var User = mongoose.model("User", userSchema);

module.exports = User;
