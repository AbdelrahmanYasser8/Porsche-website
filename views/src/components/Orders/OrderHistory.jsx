import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      try {
        setLoading(true);
        const response = await ordersApi.listMine();

        if (active) {
          setOrders(response);
        }
      } catch (fetchError) {
        if (active) {
          showToast({
            variant: "danger",
            message: fetchError.message || "Failed to load orders",
          });
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
  }, [showToast]);

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

      <div className={styles.list}>
        {loading ? (
          <div className="py-5 text-center text-secondary">Loading orders...</div>
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

      {!loading && orders.length === 0 ? (
        <div className="py-5 text-center text-secondary">No orders found.</div>
      ) : null}
    </section>
  );
}
