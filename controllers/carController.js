const Car = require("../models/Car");
const {
  normalizeCarInput,
  serializeCar,
} = require("../utils/serializers");

const getAll = async (req, res) => {
  try {
    const { category, search, year, maxPrice, status } = req.query;
    const filter = {};

    if (category && category !== "All") filter.category = category;
    if (year && year !== "All") filter.manufactureYear = Number(year);
    if (maxPrice) filter.price = { $lte: Number(maxPrice) };
    if (status && status !== "All") filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { make: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { colors: { $regex: search, $options: "i" } },
      ];
    }

    const cars = await Car.find(filter).sort({ createdAt: -1 });
    res.json(cars.map(serializeCar));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(serializeCar(car));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const car = new Car(normalizeCarInput(req.body));
    await car.save();
    res.status(201).json(serializeCar(car));
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      normalizeCarInput(req.body),
      { new: true, runValidators: true },
    );
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(serializeCar(car));
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json({ message: 'Car deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const seed = async (req, res) => {
  try {
    const count = await Car.countDocuments();
    if (count > 0) return res.json({ message: 'Cars already seeded' });

    await Car.insertMany(seedData);
    res.status(201).json({ message: 'Cars seeded', count: seedData.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const seedData = [
  { name: "911 GT3 RS", category: "Sports", manufactureYear: 2026, price: 412000, fuelType: "Gasoline", seating: 2, horsepower: 518, topSpeed: 184, status: "In Stock" },
  { name: "Taycan", category: "Electric", manufactureYear: 2025, price: 130000, fuelType: "Electric", seating: 4, horsepower: 402, topSpeed: 143, status: "In Stock" },
  { name: "Macan", category: "SUV", manufactureYear: 2026, price: 90000, fuelType: "Gasoline", seating: 4, horsepower: 261, topSpeed: 144, status: "In Stock" },
  { name: "911 Carrera", category: "Sedan", manufactureYear: 2026, price: 185000, fuelType: "Gasoline", seating: 2, horsepower: 388, topSpeed: 183, status: "In Stock" },
  { name: "Taycan Turbo S", category: "Electric", manufactureYear: 2025, price: 280000, fuelType: "Electric", seating: 4, horsepower: 761, topSpeed: 205, status: "In Stock" },
  { name: "Macan Electric", category: "SUV", manufactureYear: 2026, price: 90000, fuelType: "Electric", seating: 4, horsepower: 355, topSpeed: 137, status: "Out of Stock" },
  { name: "Macan GTS", category: "SUV", manufactureYear: 2024, price: 135000, fuelType: "Gasoline", seating: 4, horsepower: 434, topSpeed: 169, status: "In Stock" },
  { name: "Macan Turbo Electric", category: "SUV", manufactureYear: 2026, price: 155000, fuelType: "Electric", seating: 4, horsepower: 630, topSpeed: 162, status: "In Stock" },
  { name: "911 Targa 4 GTS", category: "Sedan", manufactureYear: 2025, price: 330000, fuelType: "Gasoline", seating: 2, horsepower: 473, topSpeed: 192, status: "In Stock" },
  { name: "911 Turbo S Cabriolet", category: "Sports", manufactureYear: 2026, price: 450000, fuelType: "Gasoline", seating: 2, horsepower: 640, topSpeed: 205, status: "In Stock" },
].map((car) => ({
  ...car,
  make: "Porsche",
  description: "",
  colors: "Black, White",
  wheels: ["Wheel Type 1"],
  image: "",
  thumbnailFileName: "",
  modelFileName: "",
}));

module.exports = { getAll, getById, create, update, remove, seed };
