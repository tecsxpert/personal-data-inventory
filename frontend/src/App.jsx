import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import CreateForm from "./pages/CreateForm";

function App() {
  const [editingItem, setEditingItem] = useState(null);

  return editingItem ? (
    <CreateForm item={editingItem} setEditingItem={setEditingItem} />
  ) : (
    <Dashboard setEditingItem={setEditingItem} />
  );
}

export default App;