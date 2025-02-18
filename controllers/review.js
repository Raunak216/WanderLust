const listing = require("../models/listing.js");
const review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
  let showlisting = await listing.findById(req.params.id);
  let newReview = new review(req.body.review);
  newReview.author = req.user._id;
  showlisting.reviews.push(newReview);
  await newReview.save();
  await showlisting.save();
  req.flash("success", "Review posted");
  res.redirect(`/listings/${showlisting.id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted");

  res.redirect(`/listings/${id}`);
};
