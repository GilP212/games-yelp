var mongoose   = require("mongoose");

//COMMENT SCHEMA
var commentSchema = mongoose.Schema({
    text: String,
    author: {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                username: String
    },
    created: {
                type: Date,   
                default: Date.now
    }
});

var Comment = mongoose.model("Comment", commentSchema)
module.exports = Comment;