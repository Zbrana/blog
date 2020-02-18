const express = require("express");
const router  = express.Router();
const passport = require("passport");
const User = require("../models/user");
const middleware = require("../middleware");
const Blog = require("../models/blog");

router.get("/index", (req, res) => res.redirect("/admin/index/1"));

router.get("/index/:temp", middleware.isLoggedIn, (req, res) => {
    renderArticles(req.params.temp, res);
});

function renderArticles(currentPage, res) {
    let perPage = 5;
    let page = currentPage || 1;

    Blog
    .find({ })
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec((err, blogs) => {
        Blog.countDocuments().exec((err, count) => {
            if (err) return next(err);
            blogs = blogs.sort(middleware.compare);
            res.render("admin", {
                blogs: blogs,
                current: page,
                pages: Math.ceil(count / perPage)
            })
        })
    })
}

router.get("/register", (req, res) => {
    res.render("register"); 
});

router.post("/register", (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, () => {
           res.redirect("/admin/index");
        });
    });
});

router.get("/login", (req, res) => {
    res.render("login"); 
});

router.post("/login", passport.authenticate("local", {
     successRedirect: "/admin/index",
     failureRedirect: "/admin/login"
}) , (req, res) => {
});

module.exports = router;