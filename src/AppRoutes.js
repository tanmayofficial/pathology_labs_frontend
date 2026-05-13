import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PatientEntry from "./pages/PatientEntry";
import Doctor from "./pages/Doctor";
import Ledger from "./pages/Ledger";
import Category from "./pages/Category";
import Department from "./pages/Department";
import TestGroup from "./pages/TestGroup";
import Test from "./pages/Test";
import TestReport from "./pages/TestReport";
import LedgerReport from "./pages/LedgerReport";
import CashRegister from "./pages/CashRegister";
import InvoiceReport from "./pages/InvoiceReport";
import NotFound from "./components/NotFound";
import Layout from "./components/Layout";
import Patient from "./pages/Patient";
import PatientEntryReport from "./pages/PatientEntryReport";

const AppRoutes = () => {
  const isLoggedIn = !!localStorage.getItem("authToken");

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        {/* <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />} /> */}
        <Route path="/" element={<Navigate to="/home" />} />
        {/* <Route path="/login" element={<Login />} /> */}

        {/* Protected Routes with Layout */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/home" element={<Home />} />
          <Route path="/patient-entry" element={<PatientEntry />} />
          <Route path="/doctor" element={<Doctor />} />
          <Route path="/test" element={<Test />} />
          <Route path="/test-group" element={<TestGroup />} />
          <Route path="/test-report" element={<TestReport />} />
          <Route path="/ledger" element={<Ledger />} />
          <Route path="/ledger-report" element={<LedgerReport />} />
          <Route path="/category" element={<Category />} />
          <Route path="/department" element={<Department />} />
          <Route path="/cash-register" element={<CashRegister />} />
          <Route path="/invoices" element={<InvoiceReport />} />
          <Route path="/patient" element={<Patient />} />
          <Route path="/patient-entry-report" element={<PatientEntryReport />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
