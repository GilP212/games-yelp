var Game    = require("../models/game"),
    Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Oops! You need to be logged in to do that.");
    res.redirect("/login");
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, comment){
            if(err){
                console.log(err);
                res.redirect("back");
            } else {
                if(comment.author.id.equals(req.user._id)){
                    return next();
                } else {
                    req.flash("error", "Oops! That isn't your comment to change.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Oops! You need to be logged in to do that.");
        res.redirect("back");
    }
};

middlewareObj.checkGameOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Game.findById(req.params.id, function(err, game){
            if(err){
                console.log(err);
                res.redirect("back");
            } else {
                if(game.author.id.equals(req.user._id)){
                    return next();
                } else {
                    req.flash("error", "Oops! That isn't your game to change.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Oops! You need to be logged in to do that.");
        res.redirect("back");
    }
};

module.exports = middlewareObj;