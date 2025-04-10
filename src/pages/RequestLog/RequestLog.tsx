import React, { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import RequestLogTable from "../../components/tables/BasicTables/RequestLogTable";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button";
import PageMeta from "../../components/common/PageMeta";
import { useSearchRequestLogsQuery } from "../../services/RequestLog/search";
import { useGetRequestLogDetailsQuery } from "../../services/RequestLog/details";

export default function RequestLogManagement() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filters, setFilters] = useState({
    url: "",
    httpmethod: "",
    ipaddress: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const requestLogsPerPage = 8;

  // Fetch request logs
  const { data: requestLogs = [], refetch } = useSearchRequestLogsQuery(filters);

  // State for handling details modal
  const [selectedRequestLogId, setSelectedRequestLogId] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Fetch request log details
  const { data: requestLogDetails, isLoading: isDetailsLoading } = useGetRequestLogDetailsQuery(
    { requestlogid: selectedRequestLogId! },
    { skip: !selectedRequestLogId }
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  // Handle view details
  const handleViewDetails = (requestLogId: string) => {
    setSelectedRequestLogId(requestLogId);
    setIsDetailsModalOpen(true);
  };

  // Filtered request logs based on search and filters
  const filteredRequestLogs = requestLogs.filter((log) => {
    const matchesSearch =
      log.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.httpMethod.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredRequestLogs.length / requestLogsPerPage);
  const currentRequestLogs = filteredRequestLogs.slice(
    (currentPage - 1) * requestLogsPerPage,
    currentPage * requestLogsPerPage
  );

  return (
    <>
      <PageMeta title="Request Log Management" description="" />
      <PageBreadcrumb pageTitle="Request Log Management" />
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
                placeholder="Search request logs..."
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
        </div>

        {/* Filter Panel */}
        <div
          className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl transition-transform duration-300 ease-in-out ${isFilterOpen ? "translate-x-0" : "translate-x-full"
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
              <h4 className="text-sm font-medium text-gray-500 uppercase">Filters</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  name="url"
                  placeholder="URL"
                  value={filters.url}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  name="httpmethod"
                  placeholder="HTTP Method"
                  value={filters.httpmethod}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  name="ipaddress"
                  placeholder="IP Address"
                  value={filters.ipaddress}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="flex space-x-3 border-t border-gray-200 pt-6">
              <Button
                onClick={() =>
                  setFilters({
                    url: "",
                    httpmethod: "",
                    ipaddress: "",
                  })
                }
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 text-lg"
              >
                Clear All
              </Button>
              <Button
                onClick={() => {
                  setIsFilterOpen(false);
                  refetch();
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Table and Pagination */}
        <ComponentCard title="Manage Request Logs">
          <RequestLogTable
            requestLogs={currentRequestLogs}
            onViewDetails={handleViewDetails}
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

      {/* Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        className="max-w-2xl"
      >
        <div className="p-8 bg-white dark:bg-gray-800 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white/90">
            Request Log Details
          </h2>
          {isDetailsLoading ? (
            <p className="text-gray-600 dark:text-gray-400">Loading details...</p>
          ) : requestLogDetails ? (
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Request Log ID
                </label>
                <p className="text-gray-900 dark:text-white/90 break-words font-semibold">
                  {requestLogDetails.requestlogid}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Detail ID
                  </label>
                  <p className="text-gray-900 dark:text-white/90 break-words font-semibold">
                    {requestLogDetails.detailid}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Request URL
                  </label>
                  <p className="text-gray-900 dark:text-white/90 break-words font-semibold">
                    {requestLogDetails.requesturl}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Response Status Code
                  </label>
                  <p className="text-gray-900 dark:text-white/90 font-semibold">
                    {requestLogDetails.responsestatuscode || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Response Message
                  </label>
                  <p className="text-gray-900 dark:text-white/90 font-semibold">
                    {requestLogDetails.responsemessage || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Created At
                  </label>
                  <p className="text-gray-900 dark:text-white/90 font-semibold">
                    {new Date(requestLogDetails.createdat).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Updated At
                  </label>
                  <p className="text-gray-900 dark:text-white/90 font-semibold">
                    {new Date(requestLogDetails.updatedat).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Request Params
                  </label>
                  <p className="text-gray-900 dark:text-white/90 break-words font-semibold">
                    {requestLogDetails.requestparams || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Request Data
                  </label>
                  <p className="text-gray-900 dark:text-white/90 break-words font-semibold">
                    {requestLogDetails.requestdata}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Response Data
                  </label>
                  <p className="text-gray-900 dark:text-white/90 break-words font-semibold">
                    {requestLogDetails.responsedata || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No details found.</p>
          )}
        </div>
      </Modal>
    </>
  );
}