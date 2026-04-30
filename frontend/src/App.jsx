import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CreateForm from "./pages/CreateForm";
import Detail from "./pages/Detail";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<CreateForm />} />
        <Route path="/edit/:id" element={<CreateForm />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  );
}

export default App;