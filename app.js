const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require('mongoose'),
      methodOverride = require("method-override"),
      flash = require("connect-flash"),
      passport = require("passport"),
      User = require("./models/user"),
      Blog  = require("./models/blog"),
      LocalStrategy = require("passport-local"),
      passportLocalMongoose = require("passport-local-mongoose"),
      session = require("express-session"),
      multer = require('multer'),
      fs = require('fs'),
      imageThumbnail = require('image-thumbnail'),
      middleware = require("./middleware");

const blogRoutes = require("./routes/blogs"),
      indexRoutes = require("./routes/index");

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

mongoose.connect("mongodb+srv://BliXer:stfumiabot268@blog-47rde.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.use(require("express-session")({
    secret: "VR for everybody",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/admin", indexRoutes);
app.use("/", blogRoutes);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post('/uploads/uploadImage', upload.single('image'), (req, res) => {
    res.redirect('images');
});

app.get('/uploads/images', middleware.isLoggedIn, (req, res) => {
    fs.readdir("public/images", (err, images) => {
        res.render("images", {images: images});
    });
});

app.listen(port, () => console.log(`Blog started on port ${port}!`));