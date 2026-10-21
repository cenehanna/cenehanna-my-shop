"use client";

import { useState } from "react";
import styles from "./ProfilePage.module.css";

// Мокові дані користувача
const INITIAL_USER_DATA = {
  fullName: "Anna Kovalenko",
  email: "anna.kovalenko@example.com",
  phone: "+380 (99) 123-45-67",
  address: "Poltava, Sobornosti St., 12, apt. 45",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
};

const MOCK_ORDERS = [
  {
    id: "ORD-84920",
    date: "10 Sep, 2026",
    status: "Delivered",
    total: 1270,
    items: [
      { name: "Elegant Silk Blouse", count: 1, price: 850 },
      { name: "Vintage Leather Belt", count: 1, price: 420 },
    ],
  },
  {
    id: "ORD-72311",
    date: "28 Aug, 2026",
    status: "In Transit",
    total: 1100,
    items: [{ name: "Oversized Denim Jacket", count: 1, price: 1100 }],
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal"); // 'personal' | 'orders' | 'settings'
  const [userData, setUserData] = useState(INITIAL_USER_DATA);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState(INITIAL_USER_DATA);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUserData(formState);
    setIsEditing(false);
  };

  return (
    <div className={styles.wrapper}>
      {/* Шапка профілю */}
      <div className={styles.profileHeader}>
        <div className={styles.avatarWrapper}>
          <img
            src={userData.avatar}
            alt={userData.fullName}
            className={styles.avatar}
          />
        </div>
        <div className={styles.userInfoHeader}>
          <h1 className={styles.userName}>{userData.fullName}</h1>
          <p className={styles.userEmail}>{userData.email}</p>
        </div>
      </div>

      {/* Навігація / Таби */}
      <div className={styles.navigation}>
        <button
          className={`${styles.navButton} ${activeTab === "personal" ? styles.activeNav : ""}`}
          onClick={() => setActiveTab("personal")}
        >
          Personal Info
        </button>
        <button
          className={`${styles.navButton} ${activeTab === "orders" ? styles.activeNav : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          My Orders ({MOCK_ORDERS.length})
        </button>
        <button
          className={`${styles.navButton} ${activeTab === "settings" ? styles.activeNav : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
      </div>

      {/* Контент табів */}
      <div className={styles.contentCard}>
        {/* Вкладка 1: Особисті дані */}
        {activeTab === "personal" && (
          <div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Personal Details</h2>
              {!isEditing && (
                <button
                  className={styles.editButton}
                  onClick={() => {
                    setFormState(userData);
                    setIsEditing(true);
                  }}
                >
                  Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className={styles.form}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formState.fullName}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formState.email}
                      onChange={handleInputChange}
                      className={styles.input}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formState.phone}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Default Shipping Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formState.address}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formActions}>
                  <button type="submit" className={styles.saveButton}>
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Full Name:</span>
                  <span className={styles.detailValue}>
                    {userData.fullName}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Email:</span>
                  <span className={styles.detailValue}>{userData.email}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Phone:</span>
                  <span className={styles.detailValue}>{userData.phone}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Address:</span>
                  <span className={styles.detailValue}>{userData.address}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Вкладка 2: Історія замовлень */}
        {activeTab === "orders" && (
          <div>
            <h2 className={styles.sectionTitle}>Order History</h2>
            <div className={styles.ordersList}>
              {MOCK_ORDERS.map((order) => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div>
                      <span className={styles.orderId}>#{order.id}</span>
                      <span className={styles.orderDate}>{order.date}</span>
                    </div>
                    <span
                      className={`${styles.statusBadge} ${
                        order.status === "Delivered"
                          ? styles.statusSuccess
                          : styles.statusPending
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className={styles.orderBody}>
                    <ul className={styles.itemList}>
                      {order.items.map((item, idx) => (
                        <li key={idx} className={styles.itemRow}>
                          <span>
                            {item.name} × {item.count}
                          </span>
                          <span>{item.price} ₴</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.orderFooter}>
                    <span>Order Total:</span>
                    <strong className={styles.orderTotal}>
                      {order.total} ₴
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Вкладка 3: Налаштування */}
        {activeTab === "settings" && (
          <div>
            <h2 className={styles.sectionTitle}>Account Settings</h2>
            <div className={styles.settingsSection}>
              <div className={styles.settingRow}>
                <div>
                  <h4 className={styles.settingName}>Email Notifications</h4>
                  <p className={styles.settingDesc}>
                    Receive emails with order status updates and discounts
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className={styles.checkbox}
                />
              </div>

              <div className={styles.settingRow}>
                <div>
                  <h4 className={styles.settingName}>Security</h4>
                  <p className={styles.settingDesc}>
                    Password management and two-factor authentication
                  </p>
                </div>
                <button className={styles.secondaryButton}>
                  Change Password
                </button>
              </div>

              <div className={styles.dangerZone}>
                <button className={styles.logoutButton}>Sign Out</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
