const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // Get tour data from collection
  const tours = await Tour.find();
  // Build template

  // Render template with tour data
  res.status(200).render('overview', { title: 'All Tours', tours });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // Get daa=ta for requested tour (including review and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) return next(new AppError('There is no tour with that name', 404));
  // Build template
  //render template using data from 1
  res.status(200).render('tourTemplate', { title: `${tour.name} Tour`, tour });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
});

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

// Implement virtual populate as a challenge---below is manual
exports.getMyTours = catchAsync(async (req, res, next) => {
  //find all bookings
  const bookings = await Booking.find({ user: req.user.id });
  //find tours with the returned IDs
  const tourIds = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('account', {
    user: updatedUser,
  });
});
