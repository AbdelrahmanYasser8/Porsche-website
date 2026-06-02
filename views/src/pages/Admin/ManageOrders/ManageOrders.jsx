import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ordersApi } from "../../../api/orders";
import styles from "./ManageOrders.module.css";

const statusOptions = ["All", "Processing", "Completed", "Cancelled"];

function formatCurrency(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      try {
        setLoading(true);
        setPageError("");
        const response = await ordersApi.listAll();

        if (active) {
          setOrders(response);
        }
      } catch (error) {
        if (active) {
          setPageError(error.message || "Failed to load orders");
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

  const filteredOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus = statusFilter === "All" || order.status === statusFilter;
      const matchesSearch =
        !normalizedSearch ||
        order.id.toLowerCase().includes(normalizedSearch) ||
        order.customer.toLowerCase().includes(normalizedSearch) ||
        order.product.toLowerCase().includes(normalizedSearch) ||
        order.email.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  const processingCount = orders.filter((order) => order.status === "Processing").length;
  const completedCount = orders.filter((order) => order.status === "Completed").length;
  const totalRevenue = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((total, order) => total + Number(order.amount || 0), 0);

  const handleStatusChange = async (orderId, status) => {
    try {
      setPageError("");
      const updatedOrder = await ordersApi.updateStatus(orderId, { status });
      setOrders((currentOrders) =>
        currentOrders.map((order) => (order.dbId === orderId ? updatedOrder : order)),
      );
    } catch (error) {
      setPageError(error.message || "Unable to update order status");
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

        {pageError ? (
          <div className="alert alert-danger mb-4" role="alert">
            {pageError}
          </div>
        ) : null}

        {loading ? (
          <div className="alert alert-secondary mb-4" role="status">
            Loading orders...
          </div>
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
                {filteredOrders.map((order) => (
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!loading && filteredOrders.length === 0 ? (
            <div className={styles.emptyState}>No orders match your filters.</div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
