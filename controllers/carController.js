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

async function deleteGridFsFile(fileId) {
  if (!fileId) {
    return false;
  }

  if (!ObjectId.isValid(fileId)) {
    return false;
  }

  const bucket = getGridFsBucket();
  const objectId = new ObjectId(fileId);
  const files = await bucket.find({ _id: objectId }).toArray();

  if (!files.length) {
    return false;
  }

  await bucket.delete(objectId);
  return true;
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
    res.setHeader("Cache-Control", "no-store, max-age=0, must-revalidate");
    res.setHeader("Pragma", "no-cache");
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
    const existingCar = await Car.findById(req.params.id);
    if (!existingCar) return res.status(404).json({ error: 'Car not found' });

    const car = await Car.findByIdAndUpdate(
      req.params.id,
      normalizeCarInput(req.body),
      { new: true, runValidators: true },
    );
    if (!car) return res.status(404).json({ error: 'Car not found' });

    if (existingCar.modelFileId && existingCar.modelFileId !== car.modelFileId) {
      try {
        await deleteGridFsFile(existingCar.modelFileId);
      } catch (cleanupError) {
        console.error("Failed to remove replaced model file:", cleanupError.message);
      }
    }

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
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });

    await deleteGridFsFile(car.modelFileId);

    await car.deleteOne();
    res.json({ message: 'Car deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getById, getModel, uploadModel, create, update, remove };
