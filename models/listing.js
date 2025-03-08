const { default: mongoose } = require("mongoose");
const Review = require("./review");
const User = require("./user");
const { required } = require("joi");

let listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    min: 30,
  },
  image: {
    filename: {
      type: String,
    },
    url: {
      type: String,
      default:
        "https://legalshashtra.wordpress.com/wp-content/uploads/2020/08/rental_house.png",
      set: (v) =>
        v === ""
          ? "https://legalshashtra.wordpress.com/wp-content/uploads/2020/08/rental_house.png"
          : v,
    },
  },
  price: {
    type: Number,
    min: 0,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    if (listing.reviews.length) {
      await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
