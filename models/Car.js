const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carSchema = new Schema({
  make: {
    type: String,
    trim: true,
    default: 'Porsche'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['SUV', 'Sports', 'Electric', 'Sedan', 'Coupe', 'Truck'],
    required: true
  },
  manufactureYear: {
    type: Number,
    required: true,
    min: 1948
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  colors: {
    type: String,
    trim: true
  },
  wheels: [{
    type: String
  }],
  horsepower: {
    type: Number,
    min: 0
  },
  topSpeed: {
    type: Number,
    min: 0
  },
  fuelType: {
    type: String,
    enum: ['Gasoline', 'Electric', 'Hybrid']
  },
  seating: {
    type: Number,
    min: 1
  },
  image: {
    type: String
  },
  thumbnailFileName: {
    type: String,
    trim: true
  },
  modelFileName: {
    type: String
  },
  status: {
    type: String,
    enum: ['In Stock', 'Out of Stock'],
    default: 'In Stock'
  }
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);
