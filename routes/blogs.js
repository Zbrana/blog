const express = require("express");
const router  = express.Router();
const Blog = require("../models/blog");
const middleware = require("../middleware");

router.get("/", (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log(err);
        } else {
            blogs = blogs.sort(middleware.compare);
            res.render("index", {blogs: blogs});
        }
    })
});

router.get("/new", middleware.isLoggedIn, (req, res) => res.render("new"));

router.post("/", (req, res) => {
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            res.render("new");
        } else {
            res.redirect("/admin");
        }
    });
});

router.get("/:id", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
})

router.get("/:id/edit", middleware.isLoggedIn, (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
})

router.put("/:id", (req, res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id + "/edit");
        }
    });
});

router.delete("/:id", (req, res) => {
   Blog.findByIdAndRemove(req.params.id, (err) => {
       if (err) {
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs");
       }
   })
});

module.exports = router;