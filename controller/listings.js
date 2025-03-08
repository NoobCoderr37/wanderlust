const Listing = require("../models/listing.js");
const { isValidObjectId } = require("mongoose");
const axios = require("axios");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.newListingForm = async (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createNewListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const { title, description, image, price, location, country } = req.body;
  const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    location
  )}&format=json&limit=1`;

  const response = await axios.get(geocodeUrl);
  if (response.data.length === 0) {
    return res.status(400).send("Location not found.");
  }

  const { lat, lon } = response.data[0]; // Extract latitude and longitude

  const newListing = new Listing({
    title,
    description,
    image: { url, filename },
    price,
    location,
    country,
    owner: req.user,
    geometry: {
      type: "Point",
      coordinates: [parseFloat(lon), parseFloat(lat)],
    },
  });
  console.log(newListing);
  await newListing.save();
  req.flash("success", "New listing added successfully!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res, next) => {
  const { id } = req.params;

  // Validate ID format
  if (!isValidObjectId(id)) {
    req.flash("error", "Invalid listing ID.");
    return res.redirect("/listings");
  }

  const detailListing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!detailListing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", {
    detailListing,
  });
};

module.exports.editListingForm = async (req, res) => {
  const { id } = req.params;

  const detailListing = await Listing.findById(id);
  if (!detailListing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { detailListing });
};

module.exports.updateListing = async (req, res) => {
  const url = req.file.path;
  const filename = req.file.filename;

  const { id } = req.params;
  const { title, description, image, price, location, country } = req.body;

  const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    location
  )}&format=json&limit=1`;

  const response = await axios.get(geocodeUrl);
  if (response.data.length === 0) {
    return res.status(400).send("Location not found.");
  }

  const { lat, lon } = response.data[0];

  const updatedListing = await Listing.findByIdAndUpdate(
    id,
    {
      title,
      description,
      image: { url, filename },
      price,
      location,
      country,
      owner: req.user,
      geometry: {
        type: "Point",
        coordinates: [parseFloat(lon), parseFloat(lat)],
      },
    },
    { new: true, runValidators: true }
  );

  if (!updatedListing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  req.flash(
    "success",
    `Listing "${updatedListing.title}" updated successfully!`
  );
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res, next) => {
  const { id } = req.params;

  // Validate ID format
  if (!isValidObjectId(id)) {
    req.flash("error", "Invalid listing ID.");
    return res.redirect("/listings");
  }

  // Find and delete listing
  const listing = await Listing.findByIdAndDelete(id);

  if (!listing) {
    req.flash("error", "Listing was not found.");
    return res.redirect("/listings");
  }

  req.flash("success", `Listing "${listing.title}" was successfully deleted.`);
  res.redirect("/listings");
};
