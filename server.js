var express      = require('express')
var methodO      = require("method-override");
var bodyParser   = require('body-parser')


var passport     = require('passport');
var flash        = require('connect-flash');
var cookieParser = require('cookie-parser');
var session      = require('express-session'); // cookie session


var app  = express();
var PORT = process.env.PORT || 5000;



var db   = require("./models");

app.listen(PORT);

/*

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


app.use(express.static("public"));
app.use(function(err, req, res, next) {
    console.log(err);
});


// Handlebars
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


// session secret set to a random long mix of keys
app.use(session({
    key: 'user_sid',
    resave: true,
    secret: 'kjhdfkjsdfgsfgsdkj,dn;osiruoisd.w0984093',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000,
        httpOnly: false
    }
}));

// set up passport
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());
app.use(methodO("_method"));
require('./config/passport')(passport);


var routes = require("./controllers/api-routes.js");
app.use("/", routes);
app.use("/signup", routes);
app.use("/login", routes);
app.use("/logout", routes);

db.sequelize.sync().then(function(){
	app.listen(PORT,function(){
		console.log("App listening on PORT" + PORT);
	});
});

*/