const express = require("express");
const router = express.Router({ mergeParams: true });
const review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listing.js");
const { tr } = require("@faker-js/faker");
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//rewiew post
router.post(
  "/",
  validateReview,
  isLoggedIn,
  wrapAsync(reviewController.createReview)
);
router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  reviewController.destroyReview
);

module.exports = router;
