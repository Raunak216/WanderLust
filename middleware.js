const { findById } = require("./models/review");
const listing = require("./models/listing.js");
const ExpressError = require("./utils/expressError.js");
const review = require("./models/review.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Please Login to access!");
    res.redirect("/login");
  }
  next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let showlisting = await listing.findById(id);
  if (!showlisting.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not owner of listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let newreview = await review.findById(reviewId);
  if (!newreview.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not author of review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
