import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './CarCard.module.css';
import React from "react";
import { Link } from "react-router-dom";
import { useCurrency } from "../../context/CurrencyContext";


const userIcon = <i className="fa-solid fa-user pe-2"></i>;
function fuleIcon(fuel) {
  switch (fuel) {
    case "Gasoline":
      return <i className="fa-solid fa-gas-pump pe-3 me-1"></i>;
    case "Electric":
      return <i className="fa-solid fa-bolt pe-3 me-1"></i>;
    default:
      return <i className="fa-solid fa-gas-pump pe-3 me-1"></i>;
  }
}



export default function CarCard({ id, name, year, fuel, seats, price, image, status = "In Stock" }) {
  const { formatPrice } = useCurrency();
  const isOutOfStock = status === "Out of Stock";

  return (
    <div className="col">
      <div className={`${styles.carCard} bg-white rounded-3 border h-100 d-flex flex-column overflow-hidden`}>
        <div className="p-3 pb-0">
          <div className={`${styles.carName} mb-1 fw-bold fs-5`}>{name}</div>
          <div className={`${styles.carImgWrap} rounded-2 mb-2`}>
            {isOutOfStock ? (
              <span className={styles.outOfStockBadge}>Out of Stock</span>
            ) : null}
            <img src={image} alt={name} />
          </div>
          <div className="d-flex justify-content-between mb-1" style={{ fontSize: "0.8rem", color: "#999" }}>
            <span>{year}</span>
            <span>{formatPrice(price)}</span>
          </div>
          <div className="d-flex justify-content-between mb-3" style={{ fontSize: "0.8rem", color: "#999" }}>
            <span>{fuleIcon(fuel)}{fuel}</span>
            <span>{userIcon} {seats} seats</span>
          </div>
        </div>
        <Link to={`/CarDetails/${id}`} className="mt-auto text-decoration-none">
          <div className="mt-auto d-flex justify-content-center">
            <button className={`${styles.configureBtn} btn btn-dark rounded-2 py-2 mb-3`}>
              Configure
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}
