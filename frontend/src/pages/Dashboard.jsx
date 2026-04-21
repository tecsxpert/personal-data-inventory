import { useEffect, useState } from "react";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simulate API delay
    setTimeout(() => {
      setData([
        { id: 1, name: "Google", type: "Website", status: "Active" },
        { id: 2, name: "Facebook", type: "Social", status: "Inactive" },
        { id: 3, name: "Amazon", type: "E-commerce", status: "Active" },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">List Page</h1>

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>

        <tbody>
            {data.length === 0 ? (
            <tr>
                <td colSpan="4" className="text-center p-4">
                    No data available
                </td>
            </tr>
            ) : (
                data.map((item) => (
                    <tr key={item.id}>
                        <td className="border p-2">{item.id}</td>
                        <td className="border p-2">{item.name}</td>
                        <td className="border p-2">{item.type}</td>
                     <td className="border p-2">{item.status}</td>
                    </tr>
                    ))
            )}
        </tbody>   
      </table>
    </div>
  );
};

export default Dashboard;