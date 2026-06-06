import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CarCard from "../../components/CarCard/CarCard";
import Loader from "../../components/Loader/Loader";
import Pagination from "../../components/Pagination/Pagination";
import { useToast } from "../../components/Toast/ToastProvider";
import { carsApi } from "../../api/cars";
import { getCarFallbackImage } from "../../utils/carAssets";
import { useCurrency } from "../../context/CurrencyContext";
import styles from "./CarsListing.module.css";

const CATEGORIES = ["All", "SUV", "Sports", "Electric", "Sedan"];
const YEARS = ["All", "2024", "2025", "2026"];
const PRICE_MAX = 1000000;

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
  const { formatPrice, activeCurrency } = useCurrency();
  const { showToast } = useToast();
  const [cars, setCars] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    totalItems: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(PRICE_MAX);
  const [year, setYear] = useState("All");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  useEffect(() => {
    const categoryFromUrl = getCategoryFromPath(location.pathname);
    setCategory(categoryFromUrl);
    setCurrentPage(1);
  }, [location.pathname]);

  useEffect(() => {
    let active = true;

    const loadCars = async () => {
      try {
        setLoading(true);
        const query = {
          search: search.trim() || undefined,
          category: category !== "All" ? category : undefined,
          year: year !== "All" ? year : undefined,
          maxPrice: priceRange,
          page: currentPage,
          limit: pageSize,
        };
        const response = await carsApi.list(query);
        if (active) {
          const nextCars = Array.isArray(response) ? response : response.items || [];
          setCars(nextCars);
          if (response && typeof response === "object" && "pagination" in response) {
            setPagination(response.pagination);
            setCurrentPage(response.pagination.page || currentPage);
          } else {
            setPagination({
              page: currentPage,
              limit: pageSize,
              totalItems: nextCars.length,
              totalPages: nextCars.length ? 1 : 0,
            });
          }
        }
      } catch (fetchError) {
        if (active) {
          showToast({
            variant: "danger",
            message: fetchError.message || "Failed to load cars",
          });
          setCars([]);
          setPagination({
            page: 1,
            limit: pageSize,
            totalItems: 0,
            totalPages: 0,
          });
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
  }, [category, currentPage, pageSize, priceRange, search, showToast, year]);

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(page, 1));
  };

  const handleReset = () => {
    setCategory("All");
    setPriceRange(PRICE_MAX);
    setYear("All");
    setSearch("");
    setCurrentPage(1);
  };

  return (
    <>
      <Navbar />
      <div className="container px-5 py-5" style={{ maxWidth: 1600 }}>
        <h1 className={`${styles.pageTitle} mb-3`}>Browse our collection</h1>
        <p className="text-secondary fs-6 mb-4">Explore our extensive selection of premium vehicles</p>

        <div className={`input-group mb-5 ps-2 d-flex align-items-center ${styles.searchWrapper}`} style={{ maxWidth: 600, height: 50 }}>
          <i className="fa-solid fa-magnifying-glass fs-5 ps-1 border-0"></i>
          <input
            type="text"
            className={`form-control pb-2 ${styles.searchInput}`}
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
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
                    onChange={() => {
                      setCategory(cat);
                      setCurrentPage(1);
                    }}
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
                max={PRICE_MAX}
                step={5000}
                value={priceRange}
                onChange={(e) => {
                  setPriceRange(Number(e.target.value));
                  setCurrentPage(1);
                }}
              />
              <div className="d-flex justify-content-between" style={{ fontSize: "0.82rem", color: "#888" }}>
                <span>{activeCurrency.symbol}0</span>
                <span>{formatPrice(priceRange)}</span>
              </div>

              <div className={`${styles.filterLabel} mb-2 mt-3`}>Year</div>
              <select
                className="form-select mb-2"
                style={{ fontSize: "0.9rem" }}
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              <button
                className={`btn btn-outline-secondary w-100 mt-3 ${styles.resetBtn}`}
                onClick={() => {
                  handleReset();
                  setCurrentPage(1);
                }}
              >
                Reset Filters
              </button>
            </div>
          </div>

          <div className="col-12 col-md-9">
            {loading ? (
              <Loader label="Loading vehicles..." />
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
                {cars.length === 0 ? (
                  <div className="col-12 text-center py-5 text-secondary">
                    No vehicles match your filters.
                  </div>
                ) : (
                  cars.map((car) => (
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
                  ))
                )}
              </div>
            )}
            {!loading ? (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                onPageChange={handlePageChange}
                itemLabel="vehicles"
                itemLabelSingular="vehicle"
              />
            ) : null}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
