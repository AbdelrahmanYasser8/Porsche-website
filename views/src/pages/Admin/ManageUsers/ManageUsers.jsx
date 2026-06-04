import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { usersApi } from "../../../api/users";
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
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    let active = true;

    const loadUsers = async () => {
      try {
        setLoading(true);
        setPageError("");
        const response = await usersApi.list();

        if (active) {
          setUsers(response);
        }
      } catch (error) {
        if (active) {
          setPageError(error.message || "Failed to load users");
          setUsers([]);
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
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const matched = normalizedSearch
      ? users.filter(
          (user) =>
            user.name.toLowerCase().includes(normalizedSearch) ||
            user.email.toLowerCase().includes(normalizedSearch),
        )
      : [...users];

    matched.sort((a, b) => {
      if (a.id === currentUser?.id) return -1;
      if (b.id === currentUser?.id) return 1;
      return 0;
    });

    return matched;
  }, [search, users, currentUser]);

  const totalOrders = users.reduce((total, user) => total + Number(user.ordersCount ?? user.orders ?? 0), 0);
  const activeUsers = users.filter((user) => user.status === "Active").length;
  const inactiveUsers = users.length - activeUsers;

  const handleToggleUser = async (userId, currentStatus) => {
    try {
      setPageError("");
      const nextStatus = currentStatus === "Active" ? "Inactive" : "Active";
      const updatedUser = await usersApi.updateStatus(userId, { status: nextStatus });
      setUsers((currentUsers) =>
        currentUsers.map((user) => (user.id === userId ? updatedUser : user)),
      );
    } catch (error) {
      setPageError(error.message || "Unable to update user status");
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      setPageError("");
      const updatedUser = await usersApi.updateRole(userId, { role });
      setUsers((currentUsers) =>
        currentUsers.map((user) => (user.id === userId ? updatedUser : user)),
      );
    } catch (error) {
      setPageError(error.message || "Unable to update user role");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setPageError("");
      await usersApi.remove(userId);
      setUsers((currentUsers) => currentUsers.filter((user) => user.id !== userId));
    } catch (error) {
      setPageError(error.message || "Unable to delete user");
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
            <h1>Manage Users</h1>
          </div>
        </header>

        {pageError ? (
          <div className="alert alert-danger mb-4" role="alert">
            {pageError}
          </div>
        ) : null}

        {loading ? (
          <div className="alert alert-secondary mb-4" role="status">
            Loading users...
          </div>
        ) : null}

        <label className={styles.searchBox} htmlFor="admin-user-search">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            id="admin-user-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search users by name or email..."
          />
        </label>

        <section className={styles.summaryGrid} aria-label="User summary">
          <article className={styles.summaryCard}>
            <span>Total Users</span>
            <strong>{users.length}</strong>
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
                {filteredUsers.map((user) => {
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

          {!loading && filteredUsers.length === 0 ? (
            <div className={styles.emptyState}>No users match your search.</div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
