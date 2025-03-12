
import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import UrlMappingTable from "../../components/tables/BasicTables/UrlMappingTable";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button";
import PageMeta from "../../components/common/PageMeta";

interface UrlMapping {
  id: number;
  incomingurl: string;
  mappedurl: string;
  isactive: boolean;
}

export default function UrlMappingManagement() {
  const [urlMappings, setUrlMappings] = useState<UrlMapping[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [formData, setFormData] = useState<UrlMapping>({
    id: 0,
    incomingurl: "",
    mappedurl: "",
    isactive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filters, setFilters] = useState({
    incomingurl: "",
    mappedurl: "",
    isactive: -1,
  });
  const urlMappingsPerPage = 8;

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetchUrlMappings();
    }
  }, [token]);

  const fetchUrlMappings = async () => {
    try {
      const { incomingurl, mappedurl, isactive } = filters;
      const response = await fetch(
        `http://10.20.20.54:5259/api/urlmapping/Search?incomingurl=${incomingurl}&mappedurl=${mappedurl}&isactive=${isactive}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch URL mappings");

      const data = await response.json();
      console.log("URL Mappings Response:", data);

      setUrlMappings(data); // Ensure the response is an array
    } catch (error) {
      console.error("Error fetching URL mappings:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        console.log("Saving URL Mapping with data:", formData);

        const payload = {
          id: formData.id || null,
          incomingurl: formData.incomingurl,
          mappedurl: formData.mappedurl,
          isactive: formData.isactive,
        };

        console.log("Payload being sent to API:", payload);

        const response = await fetch("http://10.20.20.54:5259/api/urlmapping/Save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response from server:", errorText);
          throw new Error(`Failed to save URL mapping: ${errorText}`);
        }

        const responseData = await response.json();
        console.log("Save URL Mapping Response:", responseData);

        if (formData.id) {
          // Update the existing URL mapping in the state
          setUrlMappings((prev) =>
            prev.map((mapping) =>
              mapping.id === formData.id ? { ...formData } : mapping
            )
          );
        } else {
          // Add the new URL mapping to the state
          const newUrlMapping = { ...formData, id: responseData.id };
          setUrlMappings((prev) => [...prev, newUrlMapping]);
        }

        setIsFormOpen(false);
        setFormData({
          id: 0,
          incomingurl: "",
          mappedurl: "",
          isactive: true,
        });

        // Fetch URL mappings again to ensure the list is up-to-date
        fetchUrlMappings();
      } catch (error) {
        console.error("Error saving URL mapping:", error);
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.incomingurl) newErrors.incomingurl = "Incoming URL is required";
    if (!formData.mappedurl) newErrors.mappedurl = "Mapped URL is required";
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

  const handlePageChange = (page: number) => setCurrentPage(page);

  const filteredUrlMappings = urlMappings.filter((mapping) => {
    const matchesSearch =
      mapping.incomingurl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mapping.mappedurl.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActive = filters.isactive === -1 || mapping.isactive === (filters.isactive === 1);

    return matchesSearch && matchesActive;
  });

  const totalPages = Math.ceil(filteredUrlMappings.length / urlMappingsPerPage);
  const currentUrlMappings = filteredUrlMappings.slice(
    (currentPage - 1) * urlMappingsPerPage,
    currentPage * urlMappingsPerPage
  );

  return (
    <>
      <PageMeta title="URL Mapping Management" description="" />
      <PageBreadcrumb pageTitle="URL Mapping Management" />
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
                placeholder="Search URL mappings..."
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
                <label className="flex items-center space-x-3 group">
                  <input
                    type="checkbox"
                    checked={filters.isactive === 1}
                    onChange={() =>
                      setFilters((prev) => ({
                        ...prev,
                        isactive: prev.isactive === 1 ? -1 : 1,
                      }))
                    }
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 group-hover:border-blue-400"
                  />
                  <span className="text-gray-700 group-hover:text-gray-900 text-lg">Active</span>
                </label>
              </div>
            </div>

            <div className="flex space-x-3 border-t border-gray-200 pt-6">
              <Button
                onClick={() =>
                  setFilters({
                    incomingurl: "",
                    mappedurl: "",
                    isactive: -1,
                  })
                }
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 text-lg"
              >
                Clear All
              </Button>
              <Button
                onClick={() => {
                  setIsFilterOpen(false);
                  fetchUrlMappings();
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Table and Pagination */}
        <ComponentCard title="Manage URL Mappings">
          <UrlMappingTable
            urlMappings={currentUrlMappings}
            onEdit={(mapping) => {
              setFormData(mapping);
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

      {/* Add/Edit URL Mapping Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} className="max-w-md">
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-xl font-semibold mb-6 dark:text-white/90">
            {formData.id ? "Edit URL Mapping" : "Add New URL Mapping"}
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 dark:text-gray-400">Incoming URL</label>
            <input
              type="text"
              name="incomingurl"
              value={formData.incomingurl}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${
                errors.incomingurl ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.incomingurl && (
              <p className="text-red-500 text-sm mt-1">{errors.incomingurl}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 dark:text-gray-400">Mapped URL</label>
            <input
              type="text"
              name="mappedurl"
              value={formData.mappedurl}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${
                errors.mappedurl ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.mappedurl && (
              <p className="text-red-500 text-sm mt-1">{errors.mappedurl}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 dark:text-gray-400">Active</label>
            <input
              type="checkbox"
              name="isactive"
              checked={formData.isactive}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isactive: e.target.checked }))
              }
              className="w-5 h-5"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 mr-4 px-6 py-3 text-lg"
              onClick={() => setIsFormOpen(false)}
            >
              Cancel
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 text-lg">
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}


























