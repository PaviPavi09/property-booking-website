import property from "../models/propertyModel.js";
import Review from "../models/reviewModel.js";

//create review
export const createReview = async (req, res) => {
  try {
    const { propertyId, rating, comment } = req.body;
    if (!propertyId || !rating) {
      return res
        .status(400)
        .json({ message: "Property ID and rating are required" });
    }
    const existingproperty = await property.findById(propertyId);
    if (!existingproperty) {
      return res.status(404).json({ message: "Property not found" });
    }
    const newReview = new Review({
      property:propertyId,
      user: req.user._id,
      rating,
      comment,
      host: existingproperty.host.toString(),
    });
    await newReview.save();
    const reviews = await Review.find({ property: propertyId });
    const avgRating =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    existingproperty.ratings = avgRating.toFixed(1);
    existingproperty.numOfReviews = reviews.length;
    await existingproperty.save();
    res
      .status(201)
      .json({ message: "Review created successfully", review: newReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

//get reviews for a property
export const getPropertyReviews = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const reviews = await Review.find({ property: propertyId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this property" });
    }
    res.status(200).json({ reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

//get reviews by user
export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate("property", "title location pricePerNight")
      .sort({ createdAt: -1 });
    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this user" });
    }
    res.status(200).json({ reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

//update review
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const { rating, comment } = req.body;
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    await review.save();
    res.status(200).json({ message: "Review updated successfully", review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

//delete review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};
