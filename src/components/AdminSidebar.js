import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => (
  <div className="admin-sidebar">
    <ul>
      <li><Link to="/admin/dashboard">Dashboard</Link></li>
      <li><Link to="/admin/users">Manage Users</Link></li>
      <li><Link to="/admin/analytics">Analytics</Link></li>
      <li><Link to="/admin/notifications">Send Notifications</Link></li>
    </ul>
  </div>
);

export default AdminSidebar;
