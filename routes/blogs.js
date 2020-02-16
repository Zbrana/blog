const express = require("express");
const router  = express.Router();
const Blog = require("../models/blog");
const middleware = require("../middleware");

router.get("/:temp", (req, res, next) => {
    if (isNaN(req.params.temp)) {
        renderArticle(req.params.temp, res);
    } else {
        renderArticles(req.params.temp, res);
    }
});

function renderArticle(title, res) {
    let titleTemp = title.split('-').join(' ');
        Blog.find({ title: titleTemp }, (err, foundBlog) => {
            if (err) {
                res.redirect("/blogs");
            } else {
                res.render("show", {blog: foundBlog[0]});
            }
        });
}

function renderArticles(currentPage, res) {
    let perPage = 5;
    let page = currentPage || 1;

    Blog
    .find({ public: 'true' })
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec((err, blogs) => {
        Blog.countDocuments().exec((err, count) => {
            if (err) return next(err);
            blogs = blogs.sort(middleware.compare);
            count = count - blogs.length;
            res.render("index", {
                blogs: blogs,
                current: page,
                pages: Math.ceil(count / perPage)
            })
        })
    })
}

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
            res.redirect("/");
        } else {
            res.redirect("/" + req.params.id + "/edit");
        }
    });
});

router.delete("/:id", (req, res) => {
   Blog.findByIdAndRemove(req.params.id, (err) => {
       if (err) {
           res.redirect("/admin");
       } else {
           res.redirect("/admin");
       }
   })
});

module.exports = router;