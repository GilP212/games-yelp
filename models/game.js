var mongoose   = require("mongoose");

//GAME SCHEMA
var gameSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

var Game = mongoose.model("Game", gameSchema);

module.exports = Game;