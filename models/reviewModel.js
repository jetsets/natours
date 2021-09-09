const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A review must have a review.'],
    },
    rating: {
      type: Number,
      max: [5, 'A rating may not be higher than 5.'],
      min: [1, ' A rating may not be lower than 1.'],
      required: [true, 'A review must have a rating.'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must reference a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must have an author.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

//Potentialy turn off populate on tour for this function, tour could still be referenced by ID
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 },
        avgRatings: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRatings,
      ratingsAverage: stats[0].avgRatings,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  //this points to current review
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.rev = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // this.rev = await this.findOne(); DOES NOT WORK HERE, QUERY ALREADY EXECUTED
  await this.rev.constructor.calcAverageRatings(this.rev.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

// select:
//       '-__v -passwordChangedAt -role -startLocation -ratingsQuantity -images -startDates -secretTour -guides -locations -slug -durationWeeks -duration -maxGroupSize -summary -description',

// POST / tour / 092384097 / reviews
