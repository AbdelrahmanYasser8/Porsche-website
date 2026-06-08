function formatCurrency(value) {
  return `$${Number(value || 0).toLocaleString("en-US")}`;
}

function formatDate(value) {
  const date = value ? new Date(value) : new Date();

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function buildOrderNumber(order) {
  const date = order.createdAt ? new Date(order.createdAt) : new Date();
  const year = date.getUTCFullYear();
  const suffix = order._id ? order._id.toString().slice(-6).toUpperCase() : "000000";

  return `ORD-${year}-${suffix}`;
}

function parseOptionList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeCarInput(body = {}) {
  const wheels = Array.isArray(body.wheels)
    ? body.wheels
    : typeof body.wheels === "string"
      ? body.wheels
          .split(",")
          .map((wheel) => wheel.trim())
          .filter(Boolean)
      : [];

  const image = body.image || body.thumbnailPreview || "";
  const manufactureYear = Number(body.manufactureYear ?? body.year);

  return {
    name: body.name?.trim(),
    make: body.make?.trim() || "Porsche",
    category: body.category,
    manufactureYear: Number.isNaN(manufactureYear) ? undefined : manufactureYear,
    price: Number(body.price),
    description: body.description?.trim() || "",
    colors: body.colors?.trim() || "",
    wheels,
    horsepower: body.horsepower === "" || body.horsepower == null ? undefined : Number(body.horsepower),
    topSpeed: body.topSpeed === "" || body.topSpeed == null ? undefined : Number(body.topSpeed),
    fuelType: body.fuelType,
    seating: body.seating === "" || body.seating == null ? undefined : Number(body.seating),
    image,
    thumbnailFileName: body.thumbnailFileName?.trim() || "",
    modelFileName: body.modelFileName?.trim() || "",
    modelFileId: body.modelFileId?.trim() || "",
    modelDataUrl: body.modelDataUrl || "",
    modelMimeType: body.modelMimeType?.trim() || "",
    status: body.status || "In Stock",
  };
}

function serializeCar(car) {
  const doc = car.toObject ? car.toObject() : car;
  const colorOptions = parseOptionList(doc.colors);
  const wheelOptions = parseOptionList(doc.wheels);
  const modelMimeType = doc.modelMimeType || "";
  const modelVersion = doc.modelFileId || doc.updatedAt?.getTime?.() || doc.updatedAt || "";
  const modelUrl = doc.modelFileId
    ? `/api/cars/${doc._id.toString()}/model?v=${encodeURIComponent(modelVersion)}`
    : doc.modelDataUrl || "";

  return {
    id: doc._id.toString(),
    make: doc.make || "Porsche",
    name: doc.name,
    category: doc.category,
    manufactureYear: doc.manufactureYear,
    year: doc.manufactureYear,
    price: doc.price,
    description: doc.description || "",
    colors: doc.colors || "",
    colorOptions,
    wheels: wheelOptions,
    wheelOptions,
    horsepower: doc.horsepower ?? 0,
    topSpeed: doc.topSpeed ?? 0,
    fuelType: doc.fuelType || "Gasoline",
    seating: doc.seating ?? 0,
    image: doc.image || "",
    thumbnailFileName: doc.thumbnailFileName || "",
    modelFileName: doc.modelFileName || "",
    modelFileId: doc.modelFileId || "",
    modelDataUrl: doc.modelDataUrl || "",
    modelMimeType,
    modelUrl,
    status: doc.status || "In Stock",
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function serializeOrder(order) {
  const doc = order.toObject ? order.toObject() : order;
  const amount = Number(doc.amount || 0);

  return {
    id: buildOrderNumber(doc),
    dbId: doc._id.toString(),
    customer: doc.customer,
    email: doc.email,
    product: doc.product,
    color: doc.color || "",
    wheelType: doc.wheelType || "",
    amount,
    total: formatCurrency(amount),
    status: doc.status || "Processing",
    date: formatDate(doc.createdAt),
    items: [
      {
        name: doc.product,
        color: doc.color || "",
        wheelType: doc.wheelType || "",
      },
    ],
    userId: doc.user ? doc.user.toString() : null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function serializeUser(user, ordersCount = 0) {
  const doc = user.toObject ? user.toObject() : user;

  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    role: doc.role || "User",
    status: doc.status || "Active",
    joinDate: formatDate(doc.createdAt),
    orders: ordersCount,
    ordersCount,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

module.exports = {
  normalizeCarInput,
  serializeCar,
  serializeOrder,
  serializeUser,
};
