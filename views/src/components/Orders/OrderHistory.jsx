import { useEffect, useState } from "react";
import { ordersApi } from "../../api/orders";
import styles from "./OrderHistory.module.css";

function StatusBadge({ status }) {
  const statusClass =
    status === "Completed"
      ? styles.completed
      : status === "Processing"
        ? styles.processing
        : styles.cancelled;

  return <span className={`${styles.statusBadge} ${statusClass}`}>{status}</span>;
}

export default function OrderHistory({ showIntro = true }) {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ORDERS_PER_PAGE = 3;

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await ordersApi.listMine();

        if (active) {
          setOrders(response);
          setCurrentPage(1);
        }
      } catch (fetchError) {
        if (active) {
          setError(fetchError.message || "Failed to load orders");
          setOrders([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      active = false;
    };
  }, []);

  const TOTAL_PAGES = Math.max(1, Math.ceil(orders.length / ORDERS_PER_PAGE));
  const safePage = Math.min(currentPage, TOTAL_PAGES);
  const start = (safePage - 1) * ORDERS_PER_PAGE;
  const paginatedOrders = orders.slice(start, start + ORDERS_PER_PAGE);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, TOTAL_PAGES));
  }, [TOTAL_PAGES]);

  return (
    <section className={styles.history}>
      {showIntro ? (
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Account activity</p>
            <h2 className={styles.title}>Order History</h2>
            <p className={styles.subtitle}>
              Review previous vehicle orders, delivery status, and the items included in each purchase.
            </p>
          </div>

          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Total orders</span>
            <strong className={styles.summaryValue}>{orders.length}</strong>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
      ) : null}

      <div className={styles.list}>
        {loading ? (
          <div className="py-5 text-center text-secondary">Loading orders...</div>
        ) : null}

        {!loading &&
          paginatedOrders.map((order) => {
            const firstItem = order.items?.[0] || {};

            return (
              <article key={order.dbId} className={styles.orderCard}>
                <div className={styles.orderTop}>
                  <div className={styles.orderMetaGrid}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Order ID</span>
                      <span className={styles.metaValue}>{order.id}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Order date</span>
                      <span className={styles.metaValue}>{order.date}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Total</span>
                      <span className={styles.metaValue}>{order.total}</span>
                    </div>
                  </div>

                  <StatusBadge status={order.status} />
                </div>

                <div className={styles.itemsBlock}>
                  <div className={styles.itemsTitle}>Item</div>
                  <div className={styles.itemsList}>
                    <div className={styles.itemRow}>
                      <div className={styles.itemName}>{firstItem.name}</div>
                      <div className={styles.itemMeta}>Color: {firstItem.color}</div>
                      <div className={styles.itemMeta}>Wheel type: {firstItem.wheelType}</div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
      </div>

      {!loading && paginatedOrders.length === 0 && !error ? (
        <div className="py-5 text-center text-secondary">No orders found.</div>
      ) : null}

      <div className={styles.pagination} aria-label="Order history pagination">
        <button
          type="button"
          className={styles.paginationArrow}
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          disabled={safePage === 1}
          aria-label="Previous page"
        >
          <i className={`fa-solid fa-angle-left ${styles.arrowIcon}`}></i>
        </button>

        {Array.from({ length: TOTAL_PAGES }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => setCurrentPage(page)}
            className={`${styles.paginationButton} ${safePage === page ? styles.paginationButtonActive : ""}`}
            aria-current={safePage === page ? "page" : undefined}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          className={styles.paginationArrow}
          onClick={() => setCurrentPage((page) => Math.min(TOTAL_PAGES, page + 1))}
          disabled={safePage === TOTAL_PAGES}
          aria-label="Next page"
        >
          <i className={`fa-solid fa-angle-right ${styles.arrowIcon}`}></i>
        </button>
      </div>
    </section>
  );
}
