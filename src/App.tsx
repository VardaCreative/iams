import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Vendors from "@/pages/Vendors.tsx";
import Purchases from "@/pages/Purchases";
import Products from "@/pages/Products";
import Tasks from "@/pages/Tasks";
import Sales from "@/pages/Sales";
import Staff from "@/pages/Staff";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import PrivateRoute from "@/components/PrivateRoute";
import { Toaster } from "@/components/ui/Toaster";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        />
      </Routes>
      <Toaster />
    </Router>
  );
}

function MainLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard");
  }, [navigate]);

  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="vendors" element={<Vendors />} />
      <Route path="purchases" element={<Purchases />} />
      <Route path="products" element={<Products />} />
      <Route path="tasks" element={<Tasks />} />
      <Route path="sales" element={<Sales />} />
      <Route path="staff" element={<Staff />} />
      <Route path="reports" element={<Reports />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
}

export default App;
