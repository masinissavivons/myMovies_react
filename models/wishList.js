var mongoose = require("mongoose");


let wishListSchema = mongoose.Schema({
    title : String,
    img : String,
})

let wishListModel = mongoose.model("wishlists", wishListSchema);
module.exports = wishListModel;