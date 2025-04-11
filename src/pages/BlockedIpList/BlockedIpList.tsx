import React, { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import IPRateLimitTable from "../../components/tables/BasicTables/BlockedIpListTable";
import IPRateLimitHistoryTable from "../../components/tables/BasicTables/IPRateLimitHistoryTable";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button";
import PageMeta from "../../components/common/PageMeta";
import { useSearchIPRateLimitsQuery, useSaveIPRateLimitMutation, useGetIPRateLimitHistoryQuery } from "../../services/BlockedIpList/ipRateLimit.service";

export default function BlockedIpList() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filters, setFilters] = useState({
    ipaddress: "",
    isblocked: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const ipRateLimitsPerPage = 8;

  // Fetch IP rate limits
  const { data: ipRateLimits = [], refetch } = useSearchIPRateLimitsQuery(filters);

  // State for handling history modal
  const [selectedIPAddress, setSelectedIPAddress] = useState<string | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // State for handling unblock modal
  const [isUnblockModalOpen, setIsUnblockModalOpen] = useState(false);
  const [unblockComment, setUnblockComment] = useState<string>("");

  // Fetch IP rate limit history
  const { data: ipRateLimitHistory, isLoading: isHistoryLoading } = useGetIPRateLimitHistoryQuery(
    { ipaddress: selectedIPAddress! },
    { skip: !selectedIPAddress }
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  // Handle view history
  const handleViewHistory = (ipAddress: string) => {
    setSelectedIPAddress(ipAddress);
    setIsHistoryModalOpen(true);
  };

  // Handle unblock button click
  const handleUnblockClick = (ipAddress: string) => {
    setSelectedIPAddress(ipAddress);
    setIsUnblockModalOpen(true);
  };

  // Handle unblock submission
  const [saveIPRateLimit] = useSaveIPRateLimitMutation();
  const handleUnblockSubmit = async () => {
    if (!unblockComment) {
      alert("Please provide a comment.");
      return;
    }
    try {
      await saveIPRateLimit({ iPaddress: selectedIPAddress!, comment: unblockComment }).unwrap();
      setIsUnblockModalOpen(false);
      setUnblockComment("");
      refetch(); // Refresh the table data
    } catch (error) {
      console.error("Failed to unblock IP:", error);
      alert("Failed to unblock IP. Please try again.");
    }
  };

  // Filtered IP rate limits based on search and filters
  const filteredIPRateLimits = ipRateLimits.filter((limit) => {
    const matchesSearch = limit.iPaddress.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filters.isblocked === "" || limit.isblocked === (filters.isblocked === "true");
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredIPRateLimits.length / ipRateLimitsPerPage);
  const currentIPRateLimits = filteredIPRateLimits.slice(
    (currentPage - 1) * ipRateLimitsPerPage,
    currentPage * ipRateLimitsPerPage
  );

  return (
    <>
      <PageMeta title="Blocked IP List" description="" />
      <PageBreadcrumb pageTitle="Blocked IP List" />
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
                placeholder="Search IP addresses..."
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
              <h4 className="text-sm font-medium text-gray-500 uppercase">Filters</h4>
              <div className="space-y-3">
                <select
                  name="isblocked"
                  value={filters.isblocked}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">All</option>
                  <option value="true">Blocked</option>
                  <option value="false">Unblocked</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 border-t border-gray-200 pt-6">
              <Button
                onClick={() =>
                  setFilters({
                    ipaddress: "",
                    isblocked: "",
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
        <ComponentCard title="Manage Blocked IPs">
          <IPRateLimitTable
            ipRateLimits={currentIPRateLimits}
            onViewHistory={handleViewHistory}
            onUnblock={handleUnblockClick}
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

      {/* History Modal */}
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        className="max-w-4xl"
      >
        <div className="p-8 bg-white dark:bg-gray-800 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white/90">
            IP Rate Limit History
          </h2>
          {isHistoryLoading ? (
            <p className="text-gray-600 dark:text-gray-400">Loading history...</p>
          ) : ipRateLimitHistory ? (
            <IPRateLimitHistoryTable history={ipRateLimitHistory} />
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No history found.</p>
          )}
        </div>
      </Modal>

      {/* Unblock Modal */}
      <Modal
        isOpen={isUnblockModalOpen}
        onClose={() => setIsUnblockModalOpen(false)}
        className="max-w-md"
      >
        <div className="p-8 bg-white dark:bg-gray-800 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white/90">
            Unblock IP Address
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Comment (Mandatory)
              </label>
              <textarea
                value={unblockComment}
                onChange={(e) => setUnblockComment(e.target.value)}
                className="w-full p-2 border rounded"
                rows={4}
                placeholder="Enter a comment..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setIsUnblockModalOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUnblockSubmit}
                className="bg-red-600 hover:bg-blue-700 text-white py-2 px-4"
              >
                Unblock
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}