const Blog = require("../models/blog");

module.exports = {
    isLoggedIn: (req, res, next) => {
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect("/admin/login");
    },
    compare: (a, b) => {
        let comparison = 0;
        if (a.created > b.created) {
          comparison = -1;
        } else {
          comparison = 1;
        }
        return comparison;
    }
}