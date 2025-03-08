const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Please provide a title for the listing.",
    "any.required": "The title field is mandatory.",
  }),
  description: Joi.string().min(30).required().messages({
    "string.min":
      "The description should be at least 30 characters long to provide enough details.",
    "string.empty": "Please include a description for the listing.",
    "any.required": "The description field is mandatory.",
  }),
  url: Joi.string().allow("", null).optional(),
  price: Joi.number().greater(0).required().messages({
    "number.base": "Please enter a valid number for the price.",
    "number.min": "The price must be greater than zero.",
    "any.required": "The price field is required to proceed.",
  }),
  location: Joi.string().required().messages({
    "string.empty": "Please provide the location for the listing.",
    "any.required": "The location field is mandatory.",
  }),
  country: Joi.string().required().messages({
    "string.empty": "Please specify the country for the listing.",
    "any.required": "The country field is mandatory.",
  }),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required().messages({
      "number.base": "The rating must be a number.",
      "number.min": "The rating must be at least 1.",
      "number.max": "The rating cannot exceed 5.",
      "any.required": "The rating field is mandatory.",
    }),
    comment: Joi.string().required().messages({
      "string.empty": "Please write a comment for the listing.",
      "any.required": "The comment field is mandatory.",
    }),
  }),
});
