import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CarCard from "../../components/CarCard/CarCard";
import { carsApi } from "../../api/cars";
import { getCarFallbackImage } from "../../utils/carAssets";
import styles from "./CarsListing.module.css";

const CATEGORIES = ["All", "SUV", "Sports", "Electric", "Sedan"];
const YEARS = ["All", "2024", "2025", "2026"];

const normalizeText = (value) => String(value || "").trim().toLowerCase();

const getCategoryFromPath = (pathname) => {
  const path = pathname.replace("/", "").toLowerCase();

  switch (path) {
    case "shop/suv":
      return "SUV";
    case "shop/sports":
      return "Sports";
    case "shop/electric":
      return "Electric";
    case "shop/sedan":
      return "Sedan";
    case "shop":
      return "All";
    default:
      return "All";
  }
};

export default function CarListing() {
  const location = useLocation();
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(1000000);
  const [priceMax, setPriceMax] = useState(1000000);
  const [year, setYear] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const categoryFromUrl = getCategoryFromPath(location.pathname);
    setCategory(categoryFromUrl);
  }, [location.pathname]);

  useEffect(() => {
    let active = true;
    const categoryQuery = categoryFromUrl => categoryFromUrl && categoryFromUrl !== "All" ? { category: categoryFromUrl } : {};

    const loadCars = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await carsApi.list(categoryQuery(getCategoryFromPath(location.pathname)));
        if (active) {
          setCars(response);
          const nextPriceMax = Math.max(
            ...response.map((car) => Number(car.price) || 0),
            1000000,
          );
          setPriceMax(nextPriceMax);
          setPriceRange(nextPriceMax);
        }
      } catch (fetchError) {
        if (active) {
          setError(fetchError.message || "Failed to load cars");
          setCars([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadCars();

    return () => {
      active = false;
    };
  }, [location.pathname]);

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return cars.filter((car) => {
      const carYear = String(car.year ?? car.manufactureYear ?? "");
      const matchesSearch =
        !normalizedSearch ||
        [car.name, car.make, car.category, carYear, String(car.price), car.status]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);
      const matchesCategory =
        category === "All" || normalizeText(car.category) === normalizeText(category);
      const matchesPrice = Number(car.price) <= priceRange;
      const matchesYear = year === "All" || carYear === year;

      return matchesSearch && matchesCategory && matchesPrice && matchesYear;
    });
  }, [cars, category, priceRange, search, year]);

  const handleReset = () => {
    setCategory("All");
    setPriceRange(priceMax);
    setYear("All");
    setSearch("");
  };

  return (
    <>
      <Navbar />
      <div className="container px-5 py-5" style={{ maxWidth: 1600 }}>
        <h1 className={`${styles.pageTitle} mb-3`}>Browse our collection</h1>
        <p className="text-secondary fs-6 mb-4">Explore our extensive selection of premium vehicles</p>

        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : null}

        <div className={`input-group mb-5 ps-2 d-flex align-items-center ${styles.searchWrapper}`} style={{ maxWidth: 600, height: 50 }}>
          <i className="fa-solid fa-magnifying-glass fs-5 ps-1 border-0"></i>
          <input
            type="text"
            className={`form-control pb-2 ${styles.searchInput}`}
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="row g-4 align-items-start">
          <div className="col-12 col-md-3">
            <div className={`${styles.filterCard} p-4`} style={{ position: "sticky", top: 24 }}>
              <div className={`${styles.filterTitle} fs-4 mb-3`}>Filters</div>

              <div className={`${styles.filterLabel} mb-3`}>Category</div>
              {CATEGORIES.map((cat) => (
                <div className="form-check mb-1" key={cat}>
                  <input
                    className={`form-check-input ${styles.formRadioInput}`}
                    type="radio"
                    name="category"
                    id={`cat-${cat}`}
                    checked={category === cat}
                    onChange={() => setCategory(cat)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`cat-${cat}`}
                    style={{ fontSize: "0.9rem", color: "#666", cursor: "pointer" }}
                  >
                    {cat}
                  </label>
                </div>
              ))}

              <div className={`${styles.filterLabel} mb-2 mt-3`}>Price range</div>
              <input
                type="range"
                className={`form-range ${styles.formRange}`}
                min={0}
                max={priceMax}
                step={5000}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
              />
              <div className="d-flex justify-content-between" style={{ fontSize: "0.82rem", color: "#888" }}>
                <span>$0</span>
                <span>${priceRange.toLocaleString()}</span>
              </div>

              <div className={`${styles.filterLabel} mb-2 mt-3`}>Year</div>
              <select
                className="form-select mb-2"
                style={{ fontSize: "0.9rem" }}
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              <button
                className={`btn btn-outline-secondary w-100 mt-3 ${styles.resetBtn}`}
                onClick={handleReset}
              >
                Reset Filters
              </button>
            </div>
          </div>

          <div className="col-12 col-md-9">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
              {loading && (
                <div className="col-12 text-center py-5 text-secondary">
                  Loading vehicles...
                </div>
              )}
              {!loading && filtered.length === 0 && (
                <div className="col-12 text-center py-5 text-secondary">
                  No vehicles match your filters.
                </div>
              )}
              {filtered.map((car) => (
                <CarCard
                  key={car.id}
                  id={car.id}
                  name={car.name}
                  year={car.year ?? car.manufactureYear}
                  fuel={car.fuelType}
                  seats={car.seating}
                  price={car.price}
                  image={getCarFallbackImage(car)}
                  status={car.status}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
