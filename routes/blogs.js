const express = require("express");
const router  = express.Router();
const Blog = require("../models/blog");
const middleware = require("../middleware");

router.get("/", (req, res) => res.redirect("/articles/1"));

router.get("/new", middleware.isLoggedIn, (req, res) => res.render("new"));

router.get("/articles/:page", (req, res, next) => {
    let perPage = 5;
    let page = req.params.page || 1;
    
    Blog
    .find({ public: 'true' })
    .sort({ created: -1 })
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec((err, blogs) => {
        Blog.countDocuments({ public: 'true' }).exec((err, count) => {
            if (err) return next(err);
            res.render("index", {
                blogs: blogs,
                current: page,
                pages: Math.ceil(count / perPage)
            })
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