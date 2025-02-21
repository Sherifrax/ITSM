import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button";

interface User {
  name: string;
  role: string;
  email: string;
  image: string;
}

export default function UserManagement() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<User>({
    name: "",
    role: "",
    email: "",
    image: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // TODO: Handle form submission
      setIsFormOpen(false);
    }
  };

  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Users Management" />
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={() => setIsFormOpen(true)}>
            Add User
          </Button>
        </div>
        <ComponentCard title="Manage Users">
          <BasicTableOne />
        </ComponentCard>
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-xl font-semibold mb-6">Add New User</h2>
          
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
            <label className="block text-sm font-medium mb-2">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${
                errors.role ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Profile Image URL
            </label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 mr-4"
              onClick={() => setIsFormOpen(false)}
            >
              Cancel
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">Save</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
