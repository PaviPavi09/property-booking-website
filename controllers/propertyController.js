import Booking from "../models/bookingModel.js";
import Property from "../models/propertyModel.js";
import cloudinary from "../utils/cloudinaryConfig.js";

// Create a new booking
export const createProperty = async (req, res) => {
  try {
    console.log("📸 Files received from multer:", JSON.stringify(req.files, null, 2));


    const {
      title,
      description,
      location,
      pricePerNight,
      propertyType,
      amenities,
      maxGuests,
      availability,
    } = req.body;

    if (!title || !description || !location || !pricePerNight || !propertyType || !maxGuests) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    console.log("Uploaded Files:", req.files); 

    const imageUrls =
      req.files?.map((file) => file.path || file?.path?.path || file.url || "") || [];

    const newProperty = await Property.create({
      title,
      description,
      location,
      pricePerNight,
      propertyType,
      amenities: amenities ? amenities.split(",") : [],
      images: imageUrls,
      maxGuests,
      availability,
      host: req.user._id,
    });

    return res.status(201).json({
      message: "Property created successfully",
      property: newProperty,
    });

  } catch (error) {
    console.error("Property Upload Error:", error.message, error.stack);

    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// Get all properties
export const getAllProperties = async (req, res) => {
  try {
    // const properties = await Property.find({ status: "approved" })
    const properties = await Property.find()
      .populate("host", "name email phone")
      .sort({ createdAt: -1 });
    return res.status(200).json({ properties });
  } catch (error) {
  console.error("Property Upload Error:", error.message);
  res.status(500).json({ message: "Server Error", error: error.message });
}

};

// Get property by ID
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "host",
      "name email phone"
    );
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    return res.status(200).json({ property });
  } catch (error) {
  console.error("Property Upload Error:", error.message);
  res.status(500).json({ message: "Server Error", error: error.message });
}

};

// Get properties of logged in host
export const getHostProperties = async (req, res) => {
  try {
    const properties = await Property.find({ host: req.user.id }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ properties });
  } catch (error) {
  console.error("Property Upload Error:", error.message);
  res.status(500).json({ message: "Server Error", error: error.message });
}

};

// Update property details
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.host.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
      const newImages = req.files?.map((file) => file.path) || [];
    const updates = { ...req.body };
    if (newImages.length > 0) updates.images = newImages;
    

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );
    return res
      .status(200)
      .json({
        message: "Property updated successfully",
        property: updatedProperty,
      });
  }catch (error) {
  console.error("Property Upload Error:", error.message);
  res.status(500).json({ message: "Server Error", error: error.message });
}

};

// Delete a property
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    if (property.host.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await Property.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Property deleted successfully" });
  }catch (error) {
  console.error("Property Upload Error:", error.message);
  res.status(500).json({ message: "Server Error", error: error.message });
}

};
