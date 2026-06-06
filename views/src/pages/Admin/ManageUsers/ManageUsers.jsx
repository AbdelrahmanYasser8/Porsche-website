import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../../components/Loader/Loader";
import Pagination from "../../../components/Pagination/Pagination";
import { usersApi } from "../../../api/users";
import { useToast } from "../../../components/Toast/ToastProvider";
import { useAuth } from "../../../context/AuthContext";
import styles from "./ManageUsers.module.css";

const roleOptions = ["User", "Admin"];

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ManageUsers() {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    totalItems: 0,
    totalPages: 0,
  });
  const [summary, setSummary] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalOrders: 0,
  });
  const [search, setSearch] = useState("");
  const [reloadToken, setReloadToken] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    let active = true;

    const loadUsers = async () => {
      try {
        setLoading(true);
        const response = await usersApi.list({
          search: search.trim() || undefined,
          page: currentPage,
          limit: pageSize,
        });

        if (active) {
          const nextUsers = Array.isArray(response) ? response : response.items || [];
          setUsers(nextUsers);
          if (response && typeof response === "object" && "pagination" in response) {
            setPagination(response.pagination);
            setSummary({
              totalUsers: response.summary?.totalUsers ?? response.pagination.totalItems ?? nextUsers.length,
              activeUsers: response.summary?.activeUsers ?? nextUsers.filter((user) => user.status === "Active").length,
              inactiveUsers: response.summary?.inactiveUsers ?? nextUsers.filter((user) => user.status !== "Active").length,
              totalOrders: response.summary?.totalOrders ?? nextUsers.reduce((total, user) => total + Number(user.ordersCount ?? user.orders ?? 0), 0),
            });
            setCurrentPage(response.pagination.page || currentPage);
          } else {
            const activeCount = nextUsers.filter((user) => user.status === "Active").length;
            setPagination({
              page: currentPage,
              limit: pageSize,
              totalItems: nextUsers.length,
              totalPages: nextUsers.length ? 1 : 0,
            });
            setSummary({
              totalUsers: nextUsers.length,
              activeUsers: activeCount,
              inactiveUsers: nextUsers.length - activeCount,
              totalOrders: nextUsers.reduce((total, user) => total + Number(user.ordersCount ?? user.orders ?? 0), 0),
            });
          }
        }
      } catch (error) {
        if (active) {
          showToast({
            variant: "danger",
            message: error.message || "Failed to load users",
          });
          setUsers([]);
          setPagination({
            page: 1,
            limit: pageSize,
            totalItems: 0,
            totalPages: 0,
          });
          setSummary({
            totalUsers: 0,
            activeUsers: 0,
            inactiveUsers: 0,
            totalOrders: 0,
          });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      active = false;
    };
  }, [currentPage, pageSize, reloadToken, search, showToast]);

  const displayUsers = useMemo(() => {
    const matched = [...users];

    matched.sort((a, b) => {
      if (a.id === currentUser?.id) return -1;
      if (b.id === currentUser?.id) return 1;
      return 0;
    });

    return matched;
  }, [users, currentUser]);

  const totalUsers = summary.totalUsers;
  const totalOrders = summary.totalOrders;
  const activeUsers = summary.activeUsers;
  const inactiveUsers = summary.inactiveUsers;
  const totalPages = pagination.totalPages;

  const handleToggleUser = async (userId, currentStatus) => {
    try {
      const nextStatus = currentStatus === "Active" ? "Inactive" : "Active";
      await usersApi.updateStatus(userId, { status: nextStatus });
      setReloadToken((current) => current + 1);
    } catch (error) {
      showToast({
        variant: "danger",
        message: error.message || "Unable to update user status",
      });
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await usersApi.updateRole(userId, { role });
      setReloadToken((current) => current + 1);
    } catch (error) {
      showToast({
        variant: "danger",
        message: error.message || "Unable to update user role",
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await usersApi.remove(userId);
      setReloadToken((current) => current + 1);
    } catch (error) {
      showToast({
        variant: "danger",
        message: error.message || "Unable to delete user",
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
            <h1>Manage Users</h1>
          </div>
        </header>

        <label className={styles.searchBox} htmlFor="admin-user-search">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            id="admin-user-search"
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search users by name or email..."
          />
        </label>

        {loading ? (
          <Loader label="Loading users..." />
        ) : null}

        {!loading ? (
          <>
            <section className={styles.summaryGrid} aria-label="User summary">
              <article className={styles.summaryCard}>
                <span>Total Users</span>
                <strong>{totalUsers}</strong>
              </article>
              <article className={styles.summaryCard}>
                <span>Active Users</span>
                <strong className={styles.successText}>{activeUsers}</strong>
              </article>
              <article className={styles.summaryCard}>
                <span>Inactive Users</span>
                <strong className={styles.dangerText}>{inactiveUsers}</strong>
              </article>
              <article className={styles.summaryCard}>
                <span>Total Active Orders</span>
                <strong>{totalOrders}</strong>
              </article>
            </section>

            <section className={styles.tablePanel}>
              <div className={styles.tableWrap}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Join Date</th>
                      <th>Orders</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayUsers.map((user) => {
                      const isOwnAccount = currentUser?.id === user.id;

                      return (
                        <tr key={user.id}>
                          <td>
                            <div className={styles.userCell}>
                              <span className={styles.avatar}>{getInitials(user.name)}</span>
                              <span>{user.name}{isOwnAccount ? <span className={styles.youBadge}>You</span> : null}</span>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <select
                              className="form-select form-select-sm"
                              value={user.role}
                              disabled={isOwnAccount}
                              onChange={(event) => handleRoleChange(user.id, event.target.value)}
                              aria-label={`Update ${user.name} role`}
                            >
                              {roleOptions.map((role) => (
                                <option key={role} value={role}>
                                  {role}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <span
                              className={`${styles.statusBadge} ${
                                user.status === "Active" ? styles.active : styles.inactive
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td>{user.joinDate}</td>
                          <td>{user.ordersCount ?? user.orders ?? 0}</td>
                          <td>
                            <div className={styles.actions}>
                              <button
                                className={styles.warnButton}
                                type="button"
                                disabled={isOwnAccount}
                                onClick={() => handleToggleUser(user.id, user.status)}
                                aria-label={`Toggle ${user.name} status`}
                                title="Toggle user status"
                              >
                                <i className="fa-solid fa-ban"></i>
                              </button>
                              <button
                                className={styles.deleteButton}
                                type="button"
                                disabled={isOwnAccount}
                                onClick={() => handleDeleteUser(user.id)}
                                aria-label={`Delete ${user.name}`}
                                title="Delete user"
                              >
                                <i className="fa-regular fa-trash-can"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {displayUsers.length === 0 ? (
                <div className={styles.emptyState}>No users match your search.</div>
              ) : null}
            </section>

            <Pagination
              currentPage={pagination.page}
              totalPages={totalPages}
              totalItems={pagination.totalItems}
              onPageChange={handlePageChange}
              itemLabel="users"
              itemLabelSingular="user"
            />
          </>
        ) : null}
      </div>
    </main>
  );
}
