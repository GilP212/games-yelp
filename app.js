//EXTERNAL MODULES
var express        = require("express"),
    app            = express(),
    flash          = require("connect-flash"),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override");

//LOCAL MODULES
var Game    = require("./models/game"),
    Comment = require("./models/comment"),
    User    = require("./models/user"),
    seedDB  = require("./seeds");

//APP CONFIG
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

//DB SETUP
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/games_yelp", {useNewUrlParser: true});
//seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Mister Peanut Butter",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//MIDDLEWARE
//Send data intoall routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//ROUTE MODULES
var commentRoutes = require("./routes/comments"),
    gameRoutes    = require("./routes/games"),
    indexRoutes    = require("./routes/index");

app.use("/", indexRoutes);
app.use("/games", gameRoutes);
app.use("/games/:id/comments", commentRoutes);

//PORT
app.listen(3000, function(){
    console.log("Server has started.");
});