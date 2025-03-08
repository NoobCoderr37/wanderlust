const express = require("express");
const router = express.Router({ mergeParams: true });
const mongoose = require("mongoose");
const wrapAsync = require("../public/js/wrapAsync.js");
const expressError = require("../public/js/expressError.js");
const { reviewSchema } = require("../public/js/schema.js");
const { loggedIn, isAuthor } = require("../middlewares");
const reviewController = require("../controller/review.js");

// Middleware for review validation
const reviewListing = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map((e) => e.message).join(", ");
    return next(new expressError(400, `Validation Error: ${errorMessage}`));
  }
  next();
};

// Middleware to validate the listing ID
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Invalid listing ID.");
    return res.redirect("/listings");
  }
  next();
};

// Route to add a review to a listing
router.post(
  "/",
  loggedIn,
  validateObjectId,
  reviewListing,
  wrapAsync(reviewController.addReview)
);

router.delete(
  "/delete/:reviewId",
  isAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
