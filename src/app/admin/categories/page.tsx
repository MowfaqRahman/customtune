import Link from "next/link";

export default function AdminCategoriesPage() {
  const categories = [
    { id: "1", name: "Electronics" },
    { id: "2", name: "Books" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
        Add New Category
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-gray-600">ID</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-gray-600">Name</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {categories.map((category) => (
              <tr key={category.id} className="border-b border-gray-200">
                <td className="py-3 px-4">{category.id}</td>
                <td className="py-3 px-4">{category.name}</td>
                <td className="py-3 px-4">
                  <Link href={`/admin/categories/${category.id}/edit`}>
                    <span className="text-blue-600 hover:text-blue-900 mr-2">Edit</span>
                  </Link>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
