import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "../../../components/Loader/Loader";
import { ordersApi } from "../../../api/orders";
import { useToast } from "../../../components/Toast/ToastProvider";
import styles from "./ManageOrders.module.css";

const statusOptions = ["All", "Processing", "Completed", "Cancelled"];

function formatCurrency(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

export default function ManageOrders() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [reloadToken, setReloadToken] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      try {
        setLoading(true);
        const response = await ordersApi.listAll({
          search: search.trim() || undefined,
          status: statusFilter,
        });

        if (active) {
          setOrders(response);
        }
      } catch (error) {
        if (active) {
          showToast({
            variant: "danger",
            message: error.message || "Failed to load orders",
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
  }, [reloadToken, search, showToast, statusFilter]);

  const processingCount = orders.filter((order) => order.status === "Processing").length;
  const completedCount = orders.filter((order) => order.status === "Completed").length;
  const totalRevenue = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((total, order) => total + Number(order.amount || 0), 0);

  const handleStatusChange = async (orderId, status) => {
    try {
      await ordersApi.updateStatus(orderId, { status });
      setReloadToken((current) => current + 1);
    } catch (error) {
      showToast({
        variant: "danger",
        message: error.message || "Unable to update order status",
      });
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.titleRow}>
            <Link className={styles.backLink} to="/admin/dashboard">
              <i className="fa-solid fa-arrow-left"></i>
              Back to Dashboard
            </Link>
            <h1>Manage Orders</h1>
          </div>
        </header>

        {loading ? (
          <Loader label="Loading orders..." />
        ) : null}

        <section className={styles.controls} aria-label="Order filters">
          <label className={styles.searchBox} htmlFor="admin-order-search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              id="admin-order-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by order ID, customer, or product..."
            />
          </label>

          <label className={styles.filterBox} htmlFor="admin-order-status">
            <i className="fa-solid fa-filter"></i>
            <select
              id="admin-order-status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </section>

        {!loading ? (
          <>
            <section className={styles.summaryGrid} aria-label="Order summary">
              <article className={styles.summaryCard}>
                <span>Total Orders</span>
                <strong>{orders.length}</strong>
              </article>
              <article className={styles.summaryCard}>
                <span>Processing</span>
                <strong className={styles.warningText}>{processingCount}</strong>
              </article>
              <article className={styles.summaryCard}>
                <span>Completed</span>
                <strong className={styles.successText}>{completedCount}</strong>
              </article>
              <article className={styles.summaryCard}>
                <span>Total Revenue</span>
                <strong className={styles.revenueText}>{formatCurrency(totalRevenue)}</strong>
              </article>
            </section>

            <section className={styles.tablePanel}>
              <div className={styles.tableWrap}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.dbId}>
                        <td>{order.id}</td>
                        <td>
                          <div className={styles.primaryText}>{order.customer}</div>
                          <div className={styles.secondaryText}>{order.email}</div>
                        </td>
                        <td>
                          <div className={styles.primaryText}>{order.product}</div>
                          <div className={styles.secondaryText}>
                            {order.color} - {order.wheelType}
                          </div>
                        </td>
                        <td>{formatCurrency(order.amount)}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>{order.date}</td>
                        <td>
                          <div className={styles.actionCell}>
                            <select
                              className={styles.statusSelect}
                              value={order.status}
                              onChange={(event) => handleStatusChange(order.dbId, event.target.value)}
                              aria-label={`Update ${order.id} status`}
                            >
                              {statusOptions
                                .filter((status) => status !== "All")
                                .map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {orders.length === 0 ? (
                <div className={styles.emptyState}>No orders match your filters.</div>
              ) : null}
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
