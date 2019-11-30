//EXTERNAL MODULES
var express = require("express");
    router  = express.Router({mergeParams: true});

//LOCAL MODULES
var Game       = require("../models/game"),
    Comment    = require("../models/comment"),
    middleware = require("../middleware");


//NEW - Show form for adding a comment to a game.
router.get("/new", middleware.isLoggedIn, function(req, res){
    Game.findById(req.params.id, function(err, game){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {game: game});
        }
    });
});

//CREATE - Add comment to a game in the DB.
router.post("/", middleware.isLoggedIn, function(req, res){
    Game.findById(req.params.id, function(err, game){
        if(err){
            console.log(err);
            res.redirect("/games"); //TODO - Error messaging.
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                    res.redirect("/games");
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();

                    game.comments.push(comment);
                    game.save();
                    
                    req.flash("success", req.user.username + ", you have successfully posted a comment.");
                    res.redirect("/games/" + game._id);
                }
            });
        }
    });
});

//EDIT - Show the form to edit a comment.
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, comment){
        if(err){
            console.log(err);
        } else {
            res.render("comments/edit", {game_id: req.params.id, comment: comment});
        }
    });
});

//UPDATE - Updates a comment's info in the DB.
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", req.user.username + ", you have successfully edited your comment.");
            res.redirect("/games/" + req.params.id);
        }
    });
});

//DELETE - Remove a comment from the DB.
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.deleteOne({_id: req.params.comment_id}, function(err, comment){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            Game.findById(req.params.id, function(err, game){
                if(err){
                    console.log(err);
                    res.redirect("back");
                } else {
                    game.comments = game.comments.filter(function(comment){
                        return !(comment._id.equals(req.params.comment_id));
                    });
                    game.save();

                    req.flash("success", req.user.username + ", you have successfully deleted your comment.");
                    res.redirect("/games/" + req.params.id);
                }
            });
        }
    });
});

module.exports = router;