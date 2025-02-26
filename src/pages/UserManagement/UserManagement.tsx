import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button";

interface ApiKey {
  apiKey: string;
  clientName: string;
  isActive: boolean;
  isIpCheck: boolean;
  isCountryCheck: boolean;
  isRegionCheck: boolean;
}

export default function UserManagement() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<ApiKey>({
    apiKey: "",
    clientName: "",
    isActive: false,
    isIpCheck: false,
    isCountryCheck: false,
    isRegionCheck: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortField, setSortField] = useState<keyof ApiKey>("clientName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const apiKeysPerPage = 10;

  // Retrieve the token from localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetchApiKeys();
    }
  }, [token]);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch(
        "http://10.20.20.54:5259/api/key/Get?apiKey=4764be7d-c397-4268-85d4-268e7e6d2f1d",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch API keys");
      }
  
      const data = await response.json();
      // Assuming the API returns an object with a 'keys' property that is an array
      setApiKeys(data.keys || []);
    } catch (error) {
      console.error("Error fetching API keys:", error);
    }
  };

  // Search API keys
  const searchApiKeys = async () => {
    try {
      const response = await fetch(
        `http://10.20.20.54:5259/api/key/Search?clientName=${searchQuery}&isActive=-1&isIpCheck=-1&isCountryCheck=-1&isRegionCheck=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to search API keys");
      }

      const data = await response.json();
      setApiKeys(data);
    } catch (error) {
      console.error("Error searching API keys:", error);
    }
  };

  // Handle form submission (add/edit API key)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch("http://10.20.20.54:5259/api/key/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to save API key");
        }

        fetchApiKeys(); // Refresh the list after saving
        setIsFormOpen(false);
        setFormData({
          apiKey: "",
          clientName: "",
          isActive: false,
          isIpCheck: false,
          isCountryCheck: false,
          isRegionCheck: false,
        });
      } catch (error) {
        console.error("Error saving API key:", error);
      }
    }
  };

  // Handle deletion of an API key
  const handleDelete = async (apiKey: string) => {
    try {
      const response = await fetch(
        `http://10.20.20.54:5259/api/key/delete?apiKey=${apiKey}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete API key");
      }

      fetchApiKeys(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting API key:", error);
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.clientName) newErrors.clientName = "Client Name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes in the form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Handle sorting
  const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortField(e.target.value as keyof ApiKey);
    setCurrentPage(1);
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as "asc" | "desc");
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Filter and sort API keys
  const filteredApiKeys = apiKeys.filter((key) =>
    key.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedApiKeys = [...filteredApiKeys].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const indexOfLastApiKey = currentPage * apiKeysPerPage;
  const indexOfFirstApiKey = indexOfLastApiKey - apiKeysPerPage;
  const currentApiKeys = sortedApiKeys.slice(indexOfFirstApiKey, indexOfLastApiKey);
  const totalPages = Math.ceil(sortedApiKeys.length / apiKeysPerPage);

  return (
    <>
      <PageBreadcrumb pageTitle="API Key Management" />
      <div className="space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <input
            type="text"
            placeholder="Search by client name..."
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
              <option value="clientName">Client Name</option>
              <option value="isActive">Active</option>
              <option value="isIpCheck">IP Check</option>
              <option value="isCountryCheck">Country Check</option>
              <option value="isRegionCheck">Region Check</option>
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

        {/* Add API Key Button */}
        <div className="flex justify-end">
          <Button onClick={() => setIsFormOpen(true)}>Add API Key</Button>
        </div>

        {/* Table */}
        <ComponentCard title="Manage API Keys">
          <BasicTableOne
            apiKeys={currentApiKeys}
            onDelete={handleDelete}
            onEdit={(apiKey) => {
              setFormData(apiKey);
              setIsFormOpen(true);
            }}
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
          <span className="flex items-center gap-2 dark:text-white/40">
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

      {/* Add/Edit API Key Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} className="max-w-md">
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-xl font-semibold mb-6 dark:text-white/90">
            {formData.apiKey ? "Edit API Key" : "Add New API Key"}
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 dark:text-gray-400">Client Name</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${
                errors.clientName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.clientName && (
              <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 dark:text-gray-400">Active</label>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
              }
              className="w-5 h-5"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 dark:text-gray-400">IP Check</label>
            <input
              type="checkbox"
              name="isIpCheck"
              checked={formData.isIpCheck}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isIpCheck: e.target.checked }))
              }
              className="w-5 h-5"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 dark:text-gray-400">Country Check</label>
            <input
              type="checkbox"
              name="isCountryCheck"
              checked={formData.isCountryCheck}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isCountryCheck: e.target.checked }))
              }
              className="w-5 h-5"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 dark:text-gray-400">Region Check</label>
            <input
              type="checkbox"
              name="isRegionCheck"
              checked={formData.isRegionCheck}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isRegionCheck: e.target.checked }))
              }
              className="w-5 h-5"
            />
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