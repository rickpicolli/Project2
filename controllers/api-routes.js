var db       = require('../models');

var express  = require("express");

var passport = require('passport');

var router   = express.Router();

var Sequelize = require('sequelize');
var Op = Sequelize.Op;

var status = {}
	
	/*------------HTML ROUTES --------------*/

	// landing page where a user is prompted to login or create an account
	// if a user is logged already redirect user to their dashboard
	router.get("/", function(req, res){
		// is user logged in
		// when a user goes to the site "/"
		// if user is not authenicated render login page / create account page
		// if user is authenticated redirected to dashboard
		console.log("#####",req.isAuthenticated())
		console.log("hellooooo");
		var hdblBrObj = {
	    loggedIn: req.isAuthenticated()
	  }
		  
	  if(req.isAuthenticated()){
	     res.redirect("/dashboard");
	  }else{
	    res.render("index", hdblBrObj);
	  }
	})

	// display user dashboard with all existing categories
	router.get("/dashboard", function(req, res){
		console.log("$$$", req.isAuthenticated());
		if(req.isAuthenticated()){
			db.category.findAll()
			.then(function(categories){
				var hndlBrsObj = {
					categories: categories,
					name: status.name
				}
				res.render("dashboard", hndlBrsObj);
			})
		}else{
			res.redirect("/");
		}
	})

	router.post("/api/favSong", function(req,res){
		console.log("============", req);
		db.saveSpotify.create({
			albumCover: req.body.albumCover,
			artistName: req.body.artistName,
			songName: req.body.songName,
			songID: req.body.songID,
			userId: req.user.id
		}, {
			include: [db.user]
		}
			).then(function(data){
			console.log("database results", data);
			res.end();
		})



	})

	router.get("/api/favSong", function(req,res){
		console.log("retrival: logged in user", req.user);
		if (!req.user) {
			res.redirect('/')
		}
		
		db.saveSpotify.findAll({
			where: {
				"userId" : req.user.id,
			},
			include: [db.user]
		}).then(function(myFavoriteSongs) {
			//res.json(myFavoriteSongs)
			res.render("favorites", {
				'myFavoriteSongs': myFavoriteSongs
			})

		})
	})

 
	/*---------------API Routes ----------------------*/

	// within the dashboard a user can click to view all of their saved items
	router.get("/api/saves", function(){
		// is user logged in
		// db.Save.findAll()
		// .then(function(saves){
		// 	var hndlBrsObj = {
		// 		saves: saves
		// 	}
		// 	res.render("index", hndlBrsObj)
		// });
	})

	// create a new save item for user
	router.post("/api/saves", function(req, res){
		// is user logged in
		// save search to saves add user foreign key
	})

	// ====================== API Routes ========================= // 

	// process the signup form ==============================================
	//=======================================================================

	router.post('/signup', function(req, res, next) {
	  passport.authenticate('local-signup', function(err, user, info) {
	    if (err) {
	      //console.log("passport err", err)
	      return next(err); // will generate a 500 error
	    }
	    // Generate a JSON response reflecting authentication status
	    if (! user) {
	      return res.send({ success : false, message : 'authentication failed' });
	    }
	    
	    // ***********************************************************************
	    // "Note that when using a custom callback, it becomes the application's
	    // responsibility to establish a session (by calling req.login()) and send
	    // a response."
	    // Source: http://passportjs.org/docs
	    // ***********************************************************************

	    req.login(user, loginErr => {
	      if (loginErr) {
	        //console.log("loginerr", loginerr)
	        return next(loginErr);
	      }

	      //console.log('redirecting....');

	      	status["code"] = 200;
	      	status["isLoggedIn"] = true;
	      	status["userId"] = user.id;
	      	status["name"] = user.name;
	      

	      res.cookie('user_name', user.name );
	      //res.json(status);

	 
	      res.redirect("dashboard");
	      
	    });      
	  })(req, res, next);
	});

	router.post('/login', function(req, res, next) {
 
	  passport.authenticate('local-login', function(err, user, info) {
	    if (err) {
	      //console.log("passport err", err)
	      return next(err); // will generate a 500 error
	    }
	    // Generate a JSON response reflecting authentication status
	    if (! user) {
	      return res.send({ success : false, message : 'authentication failed' });
	    }
	    
	    // ***********************************************************************
	    // "Note that when using a custom callback, it becomes the application's
	    // responsibility to establish a session (by calling req.login()) and send
	    // a response."
	    // Source: http://passportjs.org/docs
	    // ***********************************************************************

	    req.login(user, loginErr => {
	      if (loginErr) {
	        //console.log("loginerr", loginErr)
	        return next(loginErr);
	      }
	 
	      console.log()
	      status["code"] = 200;
      	status["isLoggedIn"] = true;
      	status["userId"] = user.id;
      	status["name"] = user.name;

	      console.log(user.firstname)
	      console.log(status);

	       res.cookie('user_name', user.name );
	 
	      res.redirect("dashboard");
	       
	      
	    });      
	  })(req, res, next);
  });

	// logout of user account
	router.get('/logout', (req, res) => {

    req.session.destroy(function(err){
      req.logout();
      res.clearCookie('user_name');
      res.clearCookie('user_sid');
      res.redirect('/');
    })
	});



	function getCurrentuserId(req){
	  var userId;
	    if(req.isAuthenticated()){
	      userId = req.session.passport.user;
	    } else {
	      userId = false
	    }
	    return userId
	}


	//edge casing for wild card
	router.get("*", function(req, res, next) {
	  if(req.url.indexOf('/api') == 0) return next();
	  if(req.url.indexOf('/assets') == 0) return next();
	  if(req.url.indexOf('/css') == 0) return next();
	  res.render("index");
	})

	module.exports = router;
