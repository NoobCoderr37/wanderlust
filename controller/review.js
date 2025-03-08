const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.addReview = async (req, res, next) => {
  const { id } = req.params;
  const { review } = req.body;

  // Create and save the review
  const rev = new Review(review);
  rev.author = req.user;
  await rev.save();

  // Find the listing and populate reviews
  const detailListing = await Listing.findById(id).populate("reviews");
  if (!detailListing) {
    throw new expressError(404, "Listing not found");
  }

  // Add the review to the listing
  detailListing.reviews.push(rev);
  await detailListing.save();

  // Set a success flash message
  req.flash(
    "success",
    "Thank you for your feedback! Your review has been successfully added."
  );

  // Redirect to the listing detail page
  res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async (req, res, next) => {
  let { id, reviewId } = req.params;

  try {
    // Attempt to delete the review
    let result = await Review.findByIdAndDelete(reviewId);

    // Check if the review was successfully deleted
    if (!result) {
      req.flash("error", "Sorry, we couldn't find that review to delete.");
      return res.redirect(`/listings/${id}`);
    }

    // Successfully deleted the review
    req.flash("success", "Your review has been successfully deleted.");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    // Catch any unexpected errors
    req.flash("error", "An error occurred while trying to delete your review.");
    res.redirect(`/listings/${id}`);
  }
};
