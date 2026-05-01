import { useState } from "react";
import api from "../services/api";


const CreateForm = ({ item, setEditingItem }) => {
  const [form, setForm] = useState({
  name: item?.name || "",
  description: item?.description || "",
  category: item?.category || "",
});

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = (e) => {
  e.preventDefault();

  let newErrors = {};

  if (!form.name) newErrors.name = "Name is required";
  if (!form.description) newErrors.description = "Description is required";
  if (!form.category) newErrors.category = "Category is required";

  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0) {
  const request = item
    ? api.put(`/api/data-items/${item.id}`, form) // UPDATE
    : api.post("/api/data-items", form); // CREATE

  request
    .then((res) => {
      setMessage(item ? "Item updated successfully ✅" : "Item created successfully ✅");
      setForm({ name: "", description: "", category: "" });

      setTimeout(() => {
        setEditingItem(null); // go back to dashboard
      }, 1000);
    })
    .catch((err) => {
      setMessage("Operation failed ❌");
    });
}if (Object.keys(newErrors).length === 0) {
    api
  .post("/api/data-items", form)
  .then((res) => {
    setMessage("Item created successfully ✅");
    setForm({ name: "", description: "", category: "" });
  })
  .catch((err) => {
    setMessage("Failed to create item ❌");
  });
  }
};

  return (
  <div className="p-6 max-w-xl mx-auto">
    <h1 className="text-2xl font-bold mb-4 text-center">
      Create Item
    </h1>

    {message && (
      <p className="text-center mb-4 text-sm font-medium">
        {message}
      </p>
    )}

    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      <div>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category}</p>
        )}
      </div>

      <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Submit
      </button>

    </form>
  </div>
);
};

export default CreateForm;