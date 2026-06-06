import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../../components/Loader/Loader";
import Pagination from "../../../components/Pagination/Pagination";
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
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    totalItems: 0,
    totalPages: 0,
  });
  const [summary, setSummary] = useState({
    totalOrders: 0,
    processingCount: 0,
    completedCount: 0,
    totalRevenue: 0,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [reloadToken, setReloadToken] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      try {
        setLoading(true);
        const response = await ordersApi.listAll({
          search: search.trim() || undefined,
          status: statusFilter,
          page: currentPage,
          limit: pageSize,
        });

        if (active) {
          const nextOrders = Array.isArray(response) ? response : response.items || [];
          setOrders(nextOrders);
          if (response && typeof response === "object" && "pagination" in response) {
            setPagination(response.pagination);
            setSummary({
              totalOrders: response.summary?.totalOrders ?? response.pagination.totalItems ?? nextOrders.length,
              processingCount: response.summary?.processingCount ?? nextOrders.filter((order) => order.status === "Processing").length,
              completedCount: response.summary?.completedCount ?? nextOrders.filter((order) => order.status === "Completed").length,
              totalRevenue: response.summary?.totalRevenue ?? nextOrders
                .filter((order) => order.status !== "Cancelled")
                .reduce((total, order) => total + Number(order.amount || 0), 0),
            });
            setCurrentPage(response.pagination.page || currentPage);
          } else {
            const processingCount = nextOrders.filter((order) => order.status === "Processing").length;
            const completedCount = nextOrders.filter((order) => order.status === "Completed").length;
            setPagination({
              page: currentPage,
              limit: pageSize,
              totalItems: nextOrders.length,
              totalPages: nextOrders.length ? 1 : 0,
            });
            setSummary({
              totalOrders: nextOrders.length,
              processingCount,
              completedCount,
              totalRevenue: nextOrders
                .filter((order) => order.status !== "Cancelled")
                .reduce((total, order) => total + Number(order.amount || 0), 0),
            });
          }
        }
      } catch (error) {
        if (active) {
          showToast({
            variant: "danger",
            message: error.message || "Failed to load orders",
          });
          setOrders([]);
          setPagination({
            page: 1,
            limit: pageSize,
            totalItems: 0,
            totalPages: 0,
          });
          setSummary({
            totalOrders: 0,
            processingCount: 0,
            completedCount: 0,
            totalRevenue: 0,
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
  }, [currentPage, pageSize, reloadToken, search, showToast, statusFilter]);

  const processingCount = summary.processingCount;
  const completedCount = summary.completedCount;
  const totalRevenue = summary.totalRevenue;
  const totalPages = pagination.totalPages;

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

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(page, 1));
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

        <section className={styles.controls} aria-label="Order filters">
          <label className={styles.searchBox} htmlFor="admin-order-search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              id="admin-order-search"
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by order ID, customer, or product..."
            />
          </label>

          <label className={styles.filterBox} htmlFor="admin-order-status">
            <i className="fa-solid fa-filter"></i>
            <select
              id="admin-order-status"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setCurrentPage(1);
              }}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </section>

        {loading ? (
          <Loader label="Loading orders..." />
        ) : null}

        {!loading ? (
          <>
            <section className={styles.summaryGrid} aria-label="Order summary">
              <article className={styles.summaryCard}>
                <span>Total Orders</span>
                <strong>{summary.totalOrders}</strong>
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

            <Pagination
              currentPage={pagination.page}
              totalPages={totalPages}
              totalItems={pagination.totalItems}
              onPageChange={handlePageChange}
              itemLabel="orders"
              itemLabelSingular="order"
            />
          </>
        ) : null}
      </div>
    </main>
  );
}
