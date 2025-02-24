import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button";
import usersData from './users.json'; // Adjust the path to your JSON file

interface User {
  id: number;
  name: string;
  position: string;
  address: string;
  salary: number;
  phone: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(usersData.users);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<User>({
    id: 0,
    name: "",
    position: "",
    address: "",
    salary: 0,
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortField, setSortField] = useState<keyof User>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 10;

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery)
  );

  // Sort users based on selected field and order
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortField(e.target.value as keyof User);
    setCurrentPage(1); // Reset to first page on new sort
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as "asc" | "desc");
    setCurrentPage(1); // Reset to first page on new sort
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.position) newErrors.position = "Position is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (formData.id === 0) {
        // Add new user
        const newUser = { ...formData, id: users.length + 1 };
        setUsers((prev) => [...prev, newUser]);
      } else {
        // Edit existing user
        setUsers((prev) =>
          prev.map((user) => (user.id === formData.id ? formData : user))
        );
      }
      setIsFormOpen(false);
      setFormData({
        id: 0,
        name: "",
        position: "",
        address: "",
        salary: 0,
        phone: "",
      });
    }
  };

  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const handleEdit = (user: User) => {
    setFormData(user);
    setIsFormOpen(true);
  };

  return (
    <>
      <PageMeta
        title="Users Management"
        description="This is the page for managing existing users, adding new users or removing current users"
      />
      <PageBreadcrumb pageTitle="Users Management" />
      <div className="space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <input
            type="text"
            placeholder="Search by name, position, address, or phone..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-4">
            <select
              value={sortField}
              onChange={handleSortFieldChange}
              className="p-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Name</option>
              <option value="position">Position</option>
              <option value="salary">Salary</option>
            </select>
            <select
              value={sortOrder}
              onChange={handleSortOrderChange}
              className="p-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        {/* Add User Button */}
        <div className="flex justify-end">
          <Button onClick={() => setIsFormOpen(true)}>Add User</Button>
        </div>

        {/* Table */}
        <ComponentCard title="Manage Users">
          <BasicTableOne
            users={currentUsers}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </ComponentCard>

        {/* Pagination */}
        <div className="flex justify-center gap-2">
          <Button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            {"<<"}
          </Button>
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {"<"}
          </Button>
          <span className="flex items-center gap-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {">"}
          </Button>
          <Button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            {">>"}
          </Button>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-xl font-semibold mb-6">
            {formData.id === 0 ? "Add New User" : "Edit User"}
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${
                errors.position ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.position && (
              <p className="text-red-500 text-sm mt-1">{errors.position}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Salary</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 mr-4"
              onClick={() => setIsFormOpen(false)}
            >
              Cancel
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}