import React from "react";
import UserBanner from "./UserBanner";

function PageHeader({ title, user, onLogout }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1.5rem",
        borderBottom: "1px solid #e2e8f0",
        paddingBottom: "1rem",
      }}
    >
      {/* Title */}
      <h1 style={{ margin: 0 }}>{title}</h1>

      {/* Right side: username + logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {user && (
          <UserBanner username={user.username} />
        )}

        <button
          onClick={onLogout}
          style={{
            padding: "0.5rem 1rem",
            background: "#e53e3e",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default PageHeader;
