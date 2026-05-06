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
    <h1 className="text-2xl font-semibold mb-5 text-center">
      Create Item
    </h1>

    {message && (
      <p className="text-center mb-4 text-sm font-medium text-blue-600">
        {message}
      </p>
    )}

    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter name"
          value={form.name}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          placeholder="Enter description"
          value={form.description}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <input
          type="text"
          name="category"
          placeholder="Enter category"
          value={form.category}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category}</p>
        )}
      </div>

      {/* Submit */}
      <button className="w-full px-4 py-2 rounded text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white">
        Submit
      </button>

    </form>
  </div>
);
};

export default CreateForm;