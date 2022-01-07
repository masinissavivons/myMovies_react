const e = require("express");
var express = require("express");
var router = express.Router();
var request = require("sync-request");

let wishListModel = require("../models/wishList");

/*    GET home page   */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});


/*    GET movie api data   */
router.get("/new-movies", function (req, res, next) {
  let raw = request(
    "GET",
    `https://api.themoviedb.org/3/discover/movie/?api_key=${process.env.MOVIE_API_KEY}&language=fr-Fr&sort_by=popularity.desc&include_image_language=fr`
  );
  let resultRaw = JSON.parse(raw.body);
  res.json({ result: true, resultRaw });
});


/*    GET / list all movies in wishList   */
router.get("/loadWishlist", async function (req, res, next) {
  let allMovies = await wishListModel.find();
  if (allMovies) {
    res.json({ result: true, allMovies });
  } else {
    res.json({ result: false });
  }
});


/*    POST / add new movie to wishList   */
router.post("/addToWishlist", async function (req, res, next) {
  let findMovie = await wishListModel.findOne({
    title: req.body.title,
  });

  if (findMovie == undefined) {
    let addedMovie = new wishListModel({
      title: req.body.title,
      img: req.body.img,
    });
    let savedAddedMovie = await addedMovie.save();

    if (savedAddedMovie) {
      res.json({ result: true });
    } else {
      res.json({ result: false });
    }
  } else {
    res.json({ result: false });
  }
});


/*    DELETE / delete a movie in wishList   */
router.delete("/deleteMovie/:name", async function (req, res, next) {
  let removedMovie = await wishListModel.deleteOne({
    title: req.params.name,
  });
  if (removedMovie) {
    res.json({ result: true });
  } else {
    res.json({ result: false });
  }
});

module.exports = router;
