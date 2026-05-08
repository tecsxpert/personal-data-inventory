import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CreateForm from "./pages/CreateForm";
import Detail from "./pages/Detail";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import ErrorBoundary from "./components/ErrorBoundary";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <ErrorBoundary>
        <Routes>

          {/* 🔓 Public route */}
          <Route path="/login" element={<Login />} />

          {/* 🔒 Protected routes */}
          <Route
            path="/"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />

          <Route
            path="/create"
            element={isAuthenticated ? <CreateForm /> : <Navigate to="/login" />}
          />

          <Route
            path="/edit/:id"
            element={isAuthenticated ? <CreateForm /> : <Navigate to="/login" />}
          />

          <Route
            path="/detail/:id"
            element={isAuthenticated ? <Detail /> : <Navigate to="/login" />}
          />

          <Route
            path="/analytics"
            element={isAuthenticated ? <Analytics /> : <Navigate to="/login" />}
          />

        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;