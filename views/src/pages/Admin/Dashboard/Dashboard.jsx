import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../../components/Footer/Footer";
import Loader from "../../../components/Loader/Loader";
import Navbar from "../../../components/Navbar/Navbar";
import { useToast } from "../../../components/Toast/ToastProvider";
import { adminApi } from "../../../api/admin";
import styles from "./Dashboard.module.css";

const quickActions = [
  {
    title: "Manage Cars",
    description: "Add, edit, or retire vehicles from inventory.",
    href: "/admin/cars",
    icon: "fa-solid fa-car-side",
  },
  {
    title: "Manage Users",
    description: "Review account records and customer access.",
    href: "/admin/users",
    icon: "fa-solid fa-user-gear",
  },
  {
    title: "Manage Orders",
    description: "Track order status and delivery progress.",
    href: "/admin/orders",
    icon: "fa-solid fa-clipboard-list",
  },
];

function formatRevenue(value) {
  if (!value) {
    return "$0";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: value >= 1000000 ? "compact" : "standard",
    maximumFractionDigits: value >= 1000000 ? 2 : 0,
  }).format(value);
}

function StatusBadge({ status }) {
  const statusClassMap = {
    Completed: styles.completed,
    Processing: styles.processing,
    Cancelled: styles.cancelled,
  };

  return <span className={`${styles.statusBadge} ${statusClassMap[status] || styles.cancelled}`}>{status}</span>;
}

export default function Dashboard() {
  const { showToast } = useToast();
  const [dashboard, setDashboard] = useState({
    stats: {
      totalUsers: 0,
      totalCars: 0,
      totalOrders: 0,
      revenue: 0,
    },
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        const response = await adminApi.getDashboardSummary();

        if (active) {
          setDashboard(response);
        }
      } catch (fetchError) {
        if (active) {
          showToast({
            variant: "danger",
            message: fetchError.message || "Failed to load dashboard",
          });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, [showToast]);

  const stats = [
    {
      label: "Total Users",
      value: String(dashboard.stats.totalUsers),
      icon: "fa-solid fa-users",
    },
    {
      label: "Total Products",
      value: String(dashboard.stats.totalCars),
      icon: "fa-solid fa-car-side",
    },
    {
      label: "Total Orders",
      value: String(dashboard.stats.totalOrders),
      icon: "fa-solid fa-bag-shopping",
    },
    {
      label: "Revenue",
      value: formatRevenue(dashboard.stats.revenue),
      icon: "fa-solid fa-dollar-sign",
    },
  ];

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.content}>
        <div className={styles.container}>
          <header className={styles.pageHeader}>
            <div>
              <p className={styles.eyebrow}>Administration</p>
              <h1 className={styles.pageTitle}>Admin Dashboard</h1>
              <p className={styles.pageSubtitle}>
                Welcome back, Admin User. Monitor inventory, order movement, and operational activity.
              </p>
            </div>
          </header>

          {loading ? (
            <Loader label="Loading dashboard..." />
          ) : null}

          {!loading ? (
            <section className={styles.statsGrid} aria-label="Dashboard summary">
              {stats.map((stat) => (
                <article className={styles.statCard} key={stat.label}>
                  <div className={styles.statTop}>
                    <span className={styles.statIcon} aria-hidden="true">
                      <i className={stat.icon}></i>
                    </span>
                  </div>
                  <span className={styles.statLabel}>{stat.label}</span>
                  <strong className={styles.statValue}>{stat.value}</strong>
                </article>
              ))}
            </section>
          ) : null}

          {!loading ? (
            <section className={styles.quickGrid} aria-label="Admin shortcuts">
              {quickActions.map((action) => (
                <Link className={styles.quickCard} to={action.href} key={action.title}>
                  <span className={styles.quickIcon} aria-hidden="true">
                    <i className={action.icon}></i>
                  </span>
                  <span>
                    <strong>{action.title}</strong>
                    <small>{action.description}</small>
                  </span>
                  <i className={`fa-solid fa-arrow-right ${styles.quickArrow}`}></i>
                </Link>
              ))}
            </section>
          ) : null}

          {!loading ? (
            <section className={styles.tablePanel}>
              <div className={styles.panelHeader}>
                <div>
                  <p className={styles.panelEyebrow}>Recent Orders</p>
                  <h2 className={styles.panelTitle}>Latest customer activity</h2>
                </div>
                <Link className={styles.textLink} to="/admin/orders">
                  View all
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>

              <div className={styles.tableWrap}>
                <table className={styles.ordersTable}>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center text-secondary py-4">
                          No recent orders found.
                        </td>
                      </tr>
                    ) : null}
                    {dashboard.recentOrders.map((order) => (
                      <tr key={order.dbId}>
                        <td>{order.id}</td>
                        <td>{order.customer}</td>
                        <td>
                          <div>{order.product}</div>
                          <div className={styles.secondaryText}>
                            {order.color} - {order.wheelType}
                          </div>
                        </td>
                        <td>{formatRevenue(order.amount)}</td>
                        <td>
                          <StatusBadge status={order.status} />
                        </td>
                        <td>{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}
