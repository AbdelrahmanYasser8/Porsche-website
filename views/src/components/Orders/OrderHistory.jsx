import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import Pagination from "../Pagination/Pagination";
import { ordersApi } from "../../api/orders";
import { useToast } from "../Toast/ToastProvider";
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
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      try {
        setLoading(true);
        const response = await ordersApi.listMine({ page: currentPage, limit: pageSize });

        if (active) {
          const nextOrders = Array.isArray(response) ? response : response.items || [];
          setOrders(nextOrders);
          if (response && typeof response === "object" && "pagination" in response) {
            setPagination(response.pagination);
            setCurrentPage(response.pagination.page || currentPage);
          } else {
            setPagination({
              page: currentPage,
              limit: pageSize,
              totalItems: nextOrders.length,
              totalPages: nextOrders.length ? 1 : 0,
            });
          }
        }
      } catch (fetchError) {
        if (active) {
          showToast({
            variant: "danger",
            message: fetchError.message || "Failed to load orders",
          });
          setOrders([]);
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

    loadOrders();

    return () => {
      active = false;
    };
  }, [currentPage, pageSize, showToast]);

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(page, 1));
  };

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
            <strong className={styles.summaryValue}>{pagination.totalItems}</strong>
          </div>
        </div>
      ) : null}

      <div className={styles.list}>
        {loading ? (
          <Loader label="Loading orders..." />
        ) : null}

        {!loading &&
          orders.map((order) => {
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

      {!loading ? (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          onPageChange={handlePageChange}
          itemLabel="orders"
          itemLabelSingular="order"
        />
      ) : null}

      {!loading && orders.length === 0 ? (
        <div className="py-5 text-center text-secondary">No orders found.</div>
      ) : null}
    </section>
  );
}
