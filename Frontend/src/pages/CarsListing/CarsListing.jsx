import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import CarCard from '../../components/CarCard/CarCard';
import styles from './CarsListing.module.css';

const CATEGORIES = ["All", "SUV", "Sports", "Electric", "Sedan"];
const YEARS = ["All", "2024", "2025", "2026"];

const CARS = [
  { id: 1, name: "911 Carrera GTS", year: "2026", fuel: "Gasoline", seats: "4", price: 185000, category: "Sports", image: "" },
  { id: 2, name: "Taycan Turbo", year: "2025", fuel: "Electric", seats: "4", price: 185000, category: "Electric", image: "" },
  { id: 3, name: "Urus S", year: "2026", fuel: "Gasoline", seats: "5", price: 200000, category: "SUV", image: "" },
  { id: 4, name: "911 Carrera GTS", year: "2026", fuel: "Gasoline", seats: "4", price: 185000, category: "Sports", image: "" },
  { id: 5, name: "Taycan Turbo", year: "2025", fuel: "Electric", seats: "4", price: 185000, category: "Electric", image: "" },
  { id: 6, name: "Urus S", year: "2026", fuel: "Gasoline", seats: "5", price: 200000, category: "SUV", image: "" },
  { id: 7, name: "911 Carrera GTS", year: "2026", fuel: "Gasoline", seats: "4", price: 185000, category: "Sports", image: "" },
  { id: 8, name: "Taycan Turbo", year: "2025", fuel: "Electric", seats: "4", price: 185000, category: "Electric", image: "" },
  { id: 9, name: "Urus S", year: "2026", fuel: "Gasoline", seats: "5", price: 200000, category: "SUV", image: "" },
];

export default function CarListing() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(200000);
  const [year, setYear] = useState("All");

  const filtered = CARS.filter((car) => {
    const matchesSearch = car.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || car.category === category;
    const matchesPrice = car.price <= priceRange;
    const matchesYear = year === "All" || car.year === year;
    return matchesSearch && matchesCategory && matchesPrice && matchesYear;
  });

  const handleReset = () => {
    setCategory("All");
    setPriceRange(200000);
    setYear("All");
    setSearch("");
  };

  return (
    <>
      <Navbar />
      <div className="container px-5 py-5" style={{ maxWidth: 1600 }}>
        <h1 className={`${styles.pageTitle} mb-3`}>Browse our collection</h1>
        <p className="text-secondary fs-6 mb-4">Explore our extensive selection of premium vehicles</p>

        <div className={`input-group mb-5 ${styles.searchWrapper}`} style={{ maxWidth: 600, height: 50 }}>
          <input
            type="text"
            className={`form-control`}
            placeholder={"🔍\u00A0\u00A0\u00A0\u00A0\u00A0Search"}
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
                    style={{ fontSize: "0.9rem", color: "#333", cursor: "pointer" }}
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
                max={200000}
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
                  <option key={y} value={y}>{y}</option>
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
              {filtered.length === 0 && (
                <div className="col-12 text-center py-5 text-secondary">
                  No vehicles match your filters.
                </div>
              )}
              {filtered.map((car) => (
                <CarCard
                  key={car.id}
                  name={car.name}
                  year={car.year}
                  fuel={car.fuel}
                  seats={car.seats}
                  price={car.price}
                  image={car.image}
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
