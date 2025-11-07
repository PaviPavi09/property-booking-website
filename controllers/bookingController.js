import Booking from "../models/bookingModel.js";
import Property from "../models/propertyModel.js";
import nodemailer from "nodemailer";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, guests } = req.body;

    // 1️⃣ Find the property
    const property = await Property.findById(propertyId).populate("host", "email name");
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // 2️⃣ Calculate number of days
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      return res.status(400).json({ message: "Invalid check-in/check-out dates" });
    }

    // 3️⃣ Calculate total price automatically
    const totalPrice = property.pricePerNight * days;

    // 4️⃣ Create booking
    const newBooking = new Booking({
      property: propertyId,
      user: req.user._id,
      host: property.host._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice,
    });

    await newBooking.save();

    // 5️⃣ Send confirmation emails (user + host)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const userMail = {
      from: `"Property Rental System" <${process.env.EMAIL_USER}>`,
      to: req.user.email,
      subject: "Booking Confirmation",
      html: `
        <h2>Booking Confirmed!</h2>
        <p>Hi ${req.user.name},</p>
        <p>Your booking for <b>${property.title}</b> is confirmed.</p>
        <p><b>Check-in:</b> ${checkIn}</p>
        <p><b>Check-out:</b> ${checkOut}</p>
        <p><b>Total Price:</b> ₹${totalPrice}</p>
        <p>Thank you for booking with us!</p>
      `,
    };

    const hostMail = {
      from: `"Property Rental System" <${process.env.EMAIL_USER}>`,
      to: property.host.email,
      subject: "New Booking Received",
      html: `
        <h2>You received a new booking!</h2>
        <p><b>Guest:</b> ${req.user.name}</p>
        <p><b>Property:</b> ${property.title}</p>
        <p><b>Check-in:</b> ${checkIn}</p>
        <p><b>Check-out:</b> ${checkOut}</p>
        <p><b>Total Price:</b> ₹${totalPrice}</p>
      `,
    };

    // Send both emails asynchronously
    await Promise.all([
      transporter.sendMail(userMail),
      transporter.sendMail(hostMail),
    ]);

    console.log(`Email sent to ${req.user.email} and ${property.host.email}`);

    res.status(201).json({
      success: true,
      message: "Booking created and emails sent successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get bookings for a user
export const GetMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("property", "title location price images")
      .sort({ createdAt: -1 });
    res.status(200).json({ bookings });
  } catch (error) {
    console.log("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get bookings for a host
export const GetHostBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ host: req.user.id })
      .populate("user", "name email phone")
      .populate("property", "title location price images")
      .sort({ createdAt: -1 });
    res.status(200).json({ bookings });
  } catch (error) {
    console.log("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//cancel booking
export const CancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (
      booking.user.toString() !== req.user.id &&
      booking.host.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this booking" });
    }

    booking.bookingStatus = "cancelled";
    booking.paymentStatus = "Refunded";
    booking.cancellationReason =
      req.body.cancellationReason || "No reason provided";

    await booking.save();

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};
