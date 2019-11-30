//EXTERNAL MODULES
var express  = require("express"),
    router   = express.Router(),
    passport = require("passport");

//LOCAL MODULES
var User = require("../models/user");

//ROOT ROUTE
router.get("/", function(req, res){
    res.redirect("/games");
});

//AUTHENTICATION ROUTES
//REGISTER - Show the register form.
router.get("/register", function(req, res){
    res.render("register");
});

//CREATE - Create new user in DB.
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Games Yelp, " + user.username + "!");
            res.redirect("/games"); 
        });
    });
});

//LOGIN - Show login form.
router.get("/login", function(req, res){
    res.render("login");
});

//AUTHENTICATE - Authenticate login attempt, start session.
router.post("/login", 
    passport.authenticate("local", 
        {
            successRedirect: "/games",
            failureRedirect: "/login"
        }), 
    function(req, res){
});

//LOGOUT - End current user session.
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/games");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;