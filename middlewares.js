const wrapAsync = require("./public/js/wrapAsync");
const passport = require("passport");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema } = require("./public/js/schema.js");
const expressError = require("./public/js/expressError.js");

// Middleware to check if the user is logged in
module.exports.loggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("error", "Please log in first!");
    res.redirect("/users/login");
  }
};

// Middleware to check if the user is the owner of the listing
module.exports.isOwner = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const detailListing = await Listing.findById(id).populate("owner");

  if (!detailListing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  if (!detailListing.owner._id.equals(req.user._id)) {
    req.flash("error", "You do not have permission to edit this listing");
    return res.redirect(`/listings/${id}`);
  }

  next();
});

module.exports.isAuthor = wrapAsync(async (req, res, next) => {
  const { id, reviewId } = req.params;
  console.log(id, reviewId);

  // Ensure req.user is available
  if (!req.user) {
    req.flash("error", "You must be logged in to perform this action.");
    return res.redirect(`/listings/${id}`);
  }

  // Fetch the review and populate the author
  const detailReview = await Review.findById(reviewId).populate("author");
  console.log(detailReview);

  if (!detailReview) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }

  // Ensure the current user is the author of the review
  if (!detailReview.author._id.equals(req.user._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }

  next();
});

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    next(
      new expressError(400, `Validation Error: ${error.details[0].message}`)
    );
  } else {
    next();
  }
};
