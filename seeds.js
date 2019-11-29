var mongoose = require("mongoose");

var Game    = require("./models/game"),
    Comment = require("./models/comment");

var data = [
    {
        name: "The Witcher 3",
        image: "https://images.g2a.com/newlayout/323x433/1x1x0/06114476276e/59108976ae653aa55c6ac1f2",
        description: "Slaying monsters and wooing wenches."
    },
    {
        name: "Fallout 4",
        image: "https://media.gamestop.com/i/gamestop/10122220/Fallout-4",
        description: "Post apocalyptic mayhem!!"
    },
    {
        name: "The Elder Scrolls 5: Skyrim",
        image: "https://www.mobygames.com/images/covers/l/376858-the-elder-scrolls-v-skyrim-special-edition-xbox-one-front-cover.png",
        description: "There are Dragons..."
    }
];

function seedDB(){
    Game.deleteMany({}, function(err){
        // if(err){
        //     console.log(err);
        // } else {
        //     data.forEach(function(seed){
        //         Game.create(seed, function(err, game){
        //             if(err){
        //                 console.log(err);
        //             } else {
        //                 Comment.create({
        //                     text: "OMG Fanboyzzzzz here boiiiii",
        //                     author: "dagil"
        //                 }, function(err, comment){
        //                     if(err){
        //                         console.log(err);
        //                     } else {
        //                         game.comments.push(comment);
        //                         game.save();
        //                     }
        //                 });
        //             }
        //         });
        //     });
        // }
    });

}

module.exports = seedDB;