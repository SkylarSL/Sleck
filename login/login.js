var express = require("Express");
var app = express();
var port = 3000;
var server = require("http").createServer(app)
var User = require("./schema.js");
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use(express.static(__dirname + "/public/login"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/public/login/login.html");
})

app.post("/addUser", function(req, res){
    var user = new User(req.body);
    user.save();
    console.log("saved: " + user);
    res.sendFile(__dirname + "/public/html/index.html");
});

app.use(express.static(__dirname + "/public/html"));

server.listen(port, () => {
    console.log("listening on " + port)
});
