const mongoose = require("mongoose");

let blogSchema = new mongoose.Schema({
    title: String,
    created: {type: Date, default: Date.now},
    image: String,
    body: String,
    reading: String,
    category: {type: String, default: "Personal Development"},
    author: {type: String, default: "Michal Zbranek"},
    public: String
});

module.exports = mongoose.model("Blog", blogSchema);