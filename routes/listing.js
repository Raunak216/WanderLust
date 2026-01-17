const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const listingController = require("../controllers/listing.js");
const {
  isLoggedIn,
  saveRedirectUrl,
  isOwner,
  validateListing,
} = require("../middleware.js");

const multer = require("multer");
const { storage } = require("../configCloud.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index)) //index route
  .post(
    isLoggedIn,
    upload.single("listing[image]"), //upload img to cloudinary
    validateListing, //we upload image then only validate by joi
    wrapAsync(listingController.createNewListings), //create route
  );

//new listings
//NOTE- if we write new below show route it will search whatever written after /listings as id
router.get("/new", isLoggedIn, listingController.renderNewListings);

//update route ->1:edit , 2:update
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm),
);
router
  .route("/:id")
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"), //upload img to cloudinary
    validateListing,
    wrapAsync(listingController.updateListings), //update route
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)) //destroy route
  .get(wrapAsync(listingController.showListings)); //show route

module.exports = router;
