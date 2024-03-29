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
var User = require("./models/user");

//APP CONFIG
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

//DB SETUP
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb+srv://dagil123:gilp7466@cluster0-ox8cv.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true});

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
//Send data into all routes
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
var port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function(){
    console.log("Server has started.");
});