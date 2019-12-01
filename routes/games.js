//EXTERNAL MODULES
var express = require("express");
    router  = express.Router();

//LOCAL MODULES
var Game       = require("../models/game"),
    Comment    = require("../models/comment"),
    middleware = require("../middleware");

//INDEX - show all games
router.get("/", function(req, res){
    Game.find({}, function(err, games){
        if(err){
            console.log(err);
        } else {
            res.render("games/index", {games: games});
        }
    });
});

//CREATE - add new game to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newGame = req.body.game;
    newGame.author = author;

    Game.create(newGame, function(err, game){
        if(err){
            console.log(err);
        } else {
            req.flash("success", "Success! You have created a new page for " + game.name);
            res.redirect("/games");
        }
    });
});

//NEW - show form for adding new game
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("games/new");
});

//SHOW - show details of specific game
router.get("/:id", middleware.isLoggedIn, function(req, res){
    Game.findById(req.params.id).populate("comments").exec(function(err, game){
        if(err){
            console.log(err);
        } else {
            res.render("games/show", {game: game});
        }
    });
});

//EDIT - Show the form to edit a game.
router.get("/:id/edit", middleware.checkGameOwnership, function(req, res){
    Game.findById(req.params.id, function(err, game){
        if(err){
            console.log(err);
        } else {
            res.render("games/edit", {game: game});
        }
    });
});

//UPDATE - Updates a game's info in the DB.
router.put("/:id", middleware.checkGameOwnership, function(req, res){
    Game.findByIdAndUpdate(req.params.id, req.body.game, function(err, game){
        if(err){
            console.log(err);
        } else{
            req.flash("success", "Success! You have updated the page for " + game.name);
            res.redirect("/games/" + req.params.id);
        }
    });
});

//DESTROY - Deletes a game from the DB.
router.delete("/:id", middleware.checkGameOwnership, function(req, res){    
    Game.findByIdAndDelete({_id: req.params.id}, function(err, game){
        console.log(game);
        if(err){
            console.log(err);
        } else {
            Comment.deleteMany({"author.username": req.user.username}, function(err){
                if(err){
                    console.log(err);
                } else {
                    req.flash("success", "Success! You have deleted the page for " + game.name);
                    res.redirect("/games");
                }
            });
        }
    });
});

module.exports = router;