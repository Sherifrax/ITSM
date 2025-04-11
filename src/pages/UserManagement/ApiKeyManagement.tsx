import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import BasicTableOne from "../../components/tables/BasicTables/ApiManagementTable";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button";
import PageMeta from "../../components/common/PageMeta";
import { useSearchApiKeysQuery } from "../../services/ApiKey/search";
import { useSaveApiKeyMutation } from "../../services/ApiKey/save";
import { FiCheck, FiLoader } from "react-icons/fi";

interface ApiKey {
  apiKey: string | null;
  clientName: string;
  isActive: boolean;
  isIpCheck: boolean;
  isCountryCheck: boolean;
  isRegionCheck: boolean;
}

export default function ApiKeyManagement() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [formData, setFormData] = useState<ApiKey>({
    apiKey: null,
    clientName: "",
    isActive: false,
    isIpCheck: false,
    isCountryCheck: false,
    isRegionCheck: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filters, setFilters] = useState({
    isActive: false,
    isIpCheck: false,
    isCountryCheck: false,
    isRegionCheck: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const apiKeysPerPage = 8;
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  const { data: searchApiKeys, refetch } = useSearchApiKeysQuery({
    clientName: searchQuery,
    isActive: filters.isActive ? 1 : -1,
    isIpCheck: filters.isIpCheck ? 1 : -1,
    isCountryCheck: filters.isCountryCheck ? 1 : -1,
    isRegionCheck: filters.isRegionCheck ? 1 : -1,
  });

  const [saveApiKey] = useSaveApiKeyMutation();

  useEffect(() => {
    if (searchApiKeys) {
      setApiKeys(searchApiKeys);
    }
  }, [searchApiKeys]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setSaveStatus("saving");
        const payload = {
          apiKey: formData.apiKey || null,
          clientName: formData.clientName,
          isActive: formData.isActive,
          isIpCheck: formData.isIpCheck,
          isCountryCheck: formData.isCountryCheck,
          isRegionCheck: formData.isRegionCheck,
        };

        await saveApiKey(payload).unwrap();
        setSaveStatus("success");
        setTimeout(() => {
          setIsFormOpen(false);
          setFormData({
            apiKey: null,
            clientName: "",
            isActive: false,
            isIpCheck: false,
            isCountryCheck: false,
            isRegionCheck: false,
          });
          refetch();
          setSaveStatus("idle");
        }, 3000);
      } catch (error) {
        console.error("Error saving API key:", error);
        setSaveStatus("error");
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.clientName) newErrors.clientName = "Client Name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({ ...prev, [name]: checked }));
    setCurrentPage(1);
  };

  const filteredApiKeys = apiKeys.filter((key) => {
    const matchesSearch = key.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActive = !filters.isActive || key.isActive;
    const matchesIpCheck = !filters.isIpCheck || key.isIpCheck;
    const matchesCountryCheck = !filters.isCountryCheck || key.isCountryCheck;
    const matchesRegionCheck = !filters.isRegionCheck || key.isRegionCheck;

    return matchesSearch && matchesActive && matchesIpCheck && matchesCountryCheck && matchesRegionCheck;
  });

  const totalPages = Math.ceil(filteredApiKeys.length / apiKeysPerPage);
  const currentApiKeys = filteredApiKeys.slice(
    (currentPage - 1) * apiKeysPerPage,
    currentPage * apiKeysPerPage
  );

  return (
    <>
      <PageMeta title="Api Key Management" description="" />
      <PageBreadcrumb pageTitle="API Key Management" />
      <div className="space-y-4 relative">
        {/* Search and Filter Section */}
        <div className="flex gap-4 items-center w-full">
          <div className="relative flex-1">
            <div className="flex rounded-lg shadow-sm hover:shadow-md transition-shadow w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>
          </div>
          <Button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="px-6 py-3 border rounded-lg bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-700 transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </Button>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors text-lg"
          >
            <span className="pr-2 text-xl">+</span>Add
          </Button>
        </div>

        {/* Filter Panel */}
        <div
          className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl transition-transform duration-300 ease-in-out ${
            isFilterOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ zIndex: 1000 }}
        >
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Advanced Filters</h3>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-500 uppercase">Status Filters</h4>
              <div className="space-y-3">
                {[
                  { label: "Active", key: "isActive" },
                  { label: "IP Check", key: "isIpCheck" },
                  { label: "Country Check", key: "isCountryCheck" },
                  { label: "Region Check", key: "isRegionCheck" },
                ].map((filter) => (
                  <label key={filter.key} className="flex items-center space-x-3 group">
                    <input
                      type="checkbox"
                      checked={filters[filter.key as keyof typeof filters]}
                      onChange={() => setFilters(prev => ({
                        ...prev,
                        [filter.key]: !prev[filter.key as keyof typeof filters]
                      }))}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 group-hover:border-blue-400"
                    />
                    <span className="text-gray-700 group-hover:text-gray-900 text-lg">{filter.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 border-t border-gray-200 pt-6">
              <Button
                onClick={() => setFilters({
                  isActive: false,
                  isIpCheck: false,
                  isCountryCheck: false,
                  isRegionCheck: false,
                })}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 text-lg"
              >
                Clear All
              </Button>
              <Button
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Table and Pagination */}
        <ComponentCard title="Manage API Keys">
          <BasicTableOne
            apiKeys={currentApiKeys}
            onEdit={(apiKey) => {
              setFormData(apiKey);
              setIsFormOpen(true);
            }}
          />
        </ComponentCard>

        {/* Pagination */}
        <div className="flex justify-center gap-2">
          <Button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            {"<<"}
          </Button>
          <Button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {"<"}
          </Button>
          <span className="flex items-center gap-2 dark:text-white/40">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {">"}
          </Button>
          <Button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            {">>"}
          </Button>
        </div>
      </div>

      {/* Add/Edit API Key Modal */}
      <Modal 
        isOpen={isFormOpen} 
        onClose={() => {
          setIsFormOpen(false);
          setFormData({
            apiKey: null,
            clientName: "",
            isActive: false,
            isIpCheck: false,
            isCountryCheck: false,
            isRegionCheck: false,
          });
          setErrors({});
          setSaveStatus("idle");
        }} 
        className="max-w-md"
      >
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
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

            <div>
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

            <div>
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

            <div>
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
          </div>

          {/* Status message */}
          <div className="mb-4">
            {saveStatus === "success" && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                <FiCheck className="h-4 w-4" />
                <span>API Key saved successfully!</span>
              </div>
            )}
            {saveStatus === "error" && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Error saving API Key. Please try again.</span>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 mr-4 px-6 py-3 text-lg"
              onClick={() => setIsFormOpen(false)}
              disabled={saveStatus === "saving"}
            >
              Cancel
            </Button>
            <Button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 text-lg min-w-24"
              disabled={saveStatus === "saving"}
            >
              {saveStatus === "saving" ? (
                <>
                  <FiLoader className="animate-spin mr-2 inline" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}