const express = require("express");
const router = express.Router();
const wrapAsync = require("../public/js/wrapAsync.js");
const { loggedIn, isOwner, validateListing } = require("../middlewares");
const listingController = require("../controller/listings.js");
const multer = require("multer");
const { storage, cloudinary } = require("../cloudeconfig.js");
const upload = multer({ storage });

// Get All Listings
router.get("/", wrapAsync(listingController.index));

// New Listing Form
router
  .route("/new")
  .get(loggedIn, wrapAsync(listingController.newListingForm))
  // create new listing
  .post(
    loggedIn,
    upload.single("url"),
    validateListing,
    wrapAsync(listingController.createNewListing)
  );

// Show Single Listing
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  // Delete Listing
  .delete(loggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Listing Form
router
  .route("/:id/edit")
  .get(loggedIn, isOwner, wrapAsync(listingController.editListingForm))
  // Update Listing
  .put(
    loggedIn,
    isOwner,
    upload.single("url"),
    validateListing,
    wrapAsync(listingController.updateListing)
  );

module.exports = router;
