const express = require("express");
const router  = express.Router();
const Blog = require("../models/blog");
const middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, (req, res) => res.render("new"));

router.get("/", (req, res, next) => {    
    Blog
    .find({ public: 'true' })
    .sort({ created: -1 })
    .exec((err, blogs) => {
        if (err) return next(err);
        res.render("index", {
            blogs: blogs
        })
    })
})

router.get("/:title", (req, res, next) => {
    if (req.params.title != 'favicon.ico') {
        let titleTemp = req.params.title.split('-').join(' ');
        Blog.find({ title: titleTemp }, (err, foundBlog) => {
            if (err) {
                res.redirect("/blogs");
            } else {
                res.render("show", {blog: foundBlog[0]});
            }
        });
    }
});

router.post("/", (req, res) => {
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            res.render("new");
        } else {
            res.redirect("/admin/index/1");
        }
    });
});

router.get("/:id/edit", middleware.isLoggedIn, (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

router.put("/:id", (req, res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if (err) {
            res.redirect("/");
        } else {
            res.redirect("/" + req.params.id + "/edit");
        }
    });
});

router.delete("/:id", (req, res) => {
   Blog.findByIdAndRemove(req.params.id, (err) => {
       if (err) {
           res.redirect("/admin/index");
       } else {
           res.redirect("/admin/index");
       }
   });
});

module.exports = router;