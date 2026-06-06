const Car = require("../models/Car");
const mongoose = require("mongoose");
const {
  normalizeCarInput,
  serializeCar,
} = require("../utils/serializers");
const {
  buildPagination,
  getPaginationParams,
} = require("../utils/pagination");

const GridFSBucket = mongoose.mongo.GridFSBucket;
const ObjectId = mongoose.mongo.ObjectId;

function getGridFsBucket() {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Database connection is not ready");
  }

  return new GridFSBucket(db, { bucketName: "carModels" });
}

function uploadBufferToGridFs(buffer, { filename, contentType }) {
  return new Promise((resolve, reject) => {
    const bucket = getGridFsBucket();
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: contentType || "application/octet-stream",
    });

    uploadStream.on("error", reject);
    uploadStream.on("finish", () => {
      resolve({
        fileId: uploadStream.id.toString(),
        filename,
        contentType: contentType || "application/octet-stream",
      });
    });

    uploadStream.end(buffer);
  });
}

const getAll = async (req, res) => {
  try {
    const { category, search, year, maxPrice, status } = req.query;
    const pagination = getPaginationParams(req.query, 9);
    const filter = {};
    const normalizedSearch = search?.trim();

    if (category && category !== "All") filter.category = category;
    if (year && year !== "All" && !Number.isNaN(Number(year))) {
      filter.manufactureYear = Number(year);
    }
    if (maxPrice && !Number.isNaN(Number(maxPrice))) {
      filter.price = { $lte: Number(maxPrice) };
    }
    if (status && status !== "All") filter.status = status;
    if (normalizedSearch) {
      const numericSearch = Number(normalizedSearch);
      const searchTerms = [
        { name: { $regex: normalizedSearch, $options: "i" } },
        { make: { $regex: normalizedSearch, $options: "i" } },
        { category: { $regex: normalizedSearch, $options: "i" } },
        { colors: { $regex: normalizedSearch, $options: "i" } },
        { description: { $regex: normalizedSearch, $options: "i" } },
        { fuelType: { $regex: normalizedSearch, $options: "i" } },
        { status: { $regex: normalizedSearch, $options: "i" } },
      ];

      if (!Number.isNaN(numericSearch)) {
        searchTerms.push(
          { manufactureYear: numericSearch },
          { price: numericSearch },
        );
      }

      filter.$or = [
        ...searchTerms,
      ];
    }

    const cars = await Car.find(filter).sort({ createdAt: -1 });
    const serializedCars = cars.map(serializeCar);

    if (!pagination) {
      return res.json(serializedCars);
    }

    const paginated = buildPagination(serializedCars, pagination.page, pagination.limit);
    res.json(paginated);
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

const getModel = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car || !car.modelFileId) {
      return res.status(404).json({ error: "Model not found" });
    }

    const bucket = getGridFsBucket();
    const fileId = new ObjectId(car.modelFileId);
    const files = await bucket.find({ _id: fileId }).toArray();
    const file = files[0];

    if (!file) {
      return res.status(404).json({ error: "Model file not found" });
    }

    res.setHeader("Content-Type", car.modelMimeType || file.contentType || "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${car.modelFileName || file.filename || "model.glb"}"`,
    );

    const downloadStream = bucket.openDownloadStream(fileId);
    downloadStream.on("error", (error) => {
      if (!res.headersSent) {
        res.status(404).json({ error: error.message || "Model file not found" });
      } else {
        res.destroy(error);
      }
    });
    downloadStream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const uploadModel = async (req, res) => {
  try {
    const buffer = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body || []);
    if (!buffer.length) {
      return res.status(400).json({ error: "Model file is required" });
    }

    const filename = (req.headers["x-file-name"] || "model.glb").toString();
    const contentType = (req.headers["content-type"] || "application/octet-stream").toString();
    const uploaded = await uploadBufferToGridFs(buffer, { filename, contentType });

    res.status(201).json({
      modelFileId: uploaded.fileId,
      modelFileName: uploaded.filename,
      modelMimeType: uploaded.contentType,
    });
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

module.exports = { getAll, getById, getModel, uploadModel, create, update, remove, seed };
