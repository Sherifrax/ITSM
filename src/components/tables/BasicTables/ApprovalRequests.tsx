import React, { useState, useMemo } from 'react';
import { FiCheck, FiX, FiClock, FiSearch, FiArrowUp, FiArrowDown, FiX as FiClose } from 'react-icons/fi';
import Button from '../../ui/button';
import { Modal } from '../../ui/modal';
import { useCompleteTaskMutation } from '../../../services/requestLaptop';
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FcViewDetails, FcApproval } from "react-icons/fc";

interface ApprovalRequestTableProps {
  requests: any[]; // Using any[] temporarily since your API response structure is complex
  isLoading?: boolean;
  refetch: () => void;
}

type SortDirection = 'asc' | 'desc';

export default function ApprovalRequestTable({ requests, isLoading, refetch }: ApprovalRequestTableProps) {
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [remarks, setRemarks] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completeTask] = useCompleteTaskMutation();

  // Pagination and filtering states
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [laptopModelFilter, setLaptopModelFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<{ start: Date | null, end: Date | null }>({ start: null, end: null });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [dateError, setDateError] = useState<string | null>(null);

  const getLaptopModel = (request: any): string => {
    const modelField = request.requestDetails?.summitMetaData?.summitAiCustomFields?.find(
      (field: any) => field.AttributeName === 'Model'
    );
    return modelField?.AttributeValue || 'N/A';
  };

  const uniqueLaptopModels = useMemo(() => {
    const models = requests
      .map((r) => getLaptopModel(r))
      .filter((model) => model !== 'N/A');
    return Array.from(new Set(models));
  }, [requests]);

  const uniqueStatuses = useMemo(() => {
    const statuses = requests.map((r) => r.taskStatus || 'Unknown');
    return Array.from(new Set(statuses));
  }, [requests]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? <FiArrowUp className="ml-1" /> : <FiArrowDown className="ml-1" />;
    }
    return null;
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        request.requestDetails?.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (request.requestDetails?.summitMetaData?.ticketNo?.toString() || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || (request.taskStatus || 'Unknown').toLowerCase() === statusFilter.toLowerCase();

      const matchesLaptopModel =
        laptopModelFilter === 'all' || getLaptopModel(request).toLowerCase() === laptopModelFilter.toLowerCase();

      // Date filter logic
      const requestDate = new Date(request.createdDate || request.requestDetails?.createdDate);
      const matchesDate =
        (!dateFilter.start || requestDate >= new Date(dateFilter.start)) &&
        (!dateFilter.end || requestDate <= new Date(new Date(dateFilter.end).setHours(23, 59, 59, 999)));

      return matchesSearch && matchesStatus && matchesLaptopModel && matchesDate;
    });
  }, [requests, searchQuery, statusFilter, laptopModelFilter, dateFilter.start, dateFilter.end]);

  const sortedRequests = useMemo(() => {
    if (!sortColumn) return filteredRequests;

    return [...filteredRequests].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortColumn) {
        case 'ticketNo':
          aValue = a.requestDetails?.summitMetaData?.ticketNo || 0;
          bValue = b.requestDetails?.summitMetaData?.ticketNo || 0;
          break;
        case 'subject':
          aValue = a.requestDetails?.subject?.toLowerCase() || '';
          bValue = b.requestDetails?.subject?.toLowerCase() || '';
          break;
        case 'laptopModel':
          aValue = getLaptopModel(a).toLowerCase();
          bValue = getLaptopModel(b).toLowerCase();
          break;
        case 'status':
          aValue = (a.taskStatus || 'unknown').toLowerCase();
          bValue = (b.taskStatus || 'unknown').toLowerCase();
          break;
        case 'createdBy':
          aValue = a.requestDetails?.createdBy?.empName?.toLowerCase() || '';
          bValue = b.requestDetails?.createdBy?.empName?.toLowerCase() || '';
          break;
        case 'date':
          aValue = new Date(a.createdDate || a.requestDetails?.createdDate).getTime();
          bValue = new Date(b.createdDate || b.requestDetails?.createdDate).getTime();
          break;
        default:
          aValue = '';
          bValue = '';
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredRequests, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedRequests.length / itemsPerPage);
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedRequests.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedRequests, currentPage]);

  const [approvalStatus, setApprovalStatus] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  const handleApproveReject = async (isApprove: boolean) => {
    if (!selectedRequest) return;
    if (!isApprove && !remarks) {
      toast.error('Please enter remarks for rejection');
      return;
    }
  
    setIsProcessing(true);
    try {
      const payload = {
        approverId: selectedRequest.assignee,
        approve: isApprove,
        remarks: isApprove ? 'Approved' : remarks,
        userProcessRequestId: selectedRequest.userProcessRequestId
      };
  
      await completeTask({
        taskId: selectedRequest.taskId,
        ...payload
      }).unwrap();
  
      const successMessage = `Request ${isApprove ? 'approved' : 'rejected'} successfully`;
      toast.success(successMessage);
      setApprovalStatus({
        show: true,
        type: 'success',
        message: successMessage
      });
  
      // Close the modal immediately
      setSelectedRequest(null);
      setRemarks('');
      
      // Force a refetch of the data
      await refetch();
      
    } catch (error) {
      const errorMessage = `Failed to ${isApprove ? 'approve' : 'reject'} request`;
      toast.error(errorMessage);
      setApprovalStatus({
        show: true,
        type: 'error',
        message: errorMessage
      });
      console.error('Error completing task:', error);
    } finally {
      setIsProcessing(false);
  
      // Hide the status message after 3 seconds
      setTimeout(() => {
        setApprovalStatus(prev => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        No pending approval requests found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Section */}
      <div className="flex gap-4 items-center w-full">
        <div className="relative flex-1">
          <div className="flex rounded-full shadow-md transition-shadow w-full bg-gray-100 dark:bg-gray-800">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <FiSearch className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search by Ticket No or Subject..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-3 pl-12 pr-4 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg bg-transparent text-base bg-white dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        <Button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="px-6 py-3 border rounded-full bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 shadow-md transition-colors flex items-center gap-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
        >
          <svg
            className="w-6 h-6 text-gray-700 dark:text-white"
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
          {/* <span className="sm-inline text-gray-700">Filters</span> */}
        </Button>
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
  <>
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
      onClick={() => setIsFilterOpen(false)}
    />
    <div
      className="fixed top-15 right-0 h-[calc(100%-5rem)] w-96 bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-300 ease-in-out z-50 rounded-l-3xl flex flex-col"
      style={{ minHeight: "calc(100vh - 5rem)" }}
    >
      {/* Filter Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Advanced Filters
          </h3>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
            aria-label="Close filter panel"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Filter Body - Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-500 uppercase dark:text-gray-400 tracking-wider">
            Status Filters
          </h4>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-4 border border-gray-300 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="all">All Statuses</option>
            {uniqueStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-500 uppercase dark:text-gray-400 tracking-wider">
            Laptop Models
          </h4>
          <select
            value={laptopModelFilter}
            onChange={(e) => {
              setLaptopModelFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-4 border border-gray-300 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="all">All Models</option>
            {uniqueLaptopModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-500 uppercase dark:text-gray-400 tracking-wider">
            Date Range
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                From
              </label>
              <DatePicker
                selected={dateFilter.start}
                onChange={(date: Date | null) => {
                  if (date && dateFilter.end && date > dateFilter.end) {
                    setDateError("Start date can't be after end date");
                  } else {
                    setDateError(null);
                    setDateFilter({ ...dateFilter, start: date });
                  }
                }}
                selectsStart
                startDate={dateFilter.start}
                endDate={dateFilter.end}
                maxDate={dateFilter.end || new Date()}
                placeholderText="Select start date"
                className="w-full p-3 border border-gray-300 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                wrapperClassName="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                To
              </label>
              <DatePicker
                selected={dateFilter.end}
                onChange={(date: Date | null) => {
                  if (date && dateFilter.start && date < dateFilter.start) {
                    setDateError("End date can't be before start date");
                  } else {
                    setDateError(null);
                    setDateFilter({ ...dateFilter, end: date });
                  }
                }}
                selectsEnd
                startDate={dateFilter.start}
                endDate={dateFilter.end}
                minDate={dateFilter.start || undefined}
                maxDate={new Date()}
                placeholderText="Select end date"
                className="w-full p-3 border border-gray-300 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                wrapperClassName="w-full"
              />
            </div>

            {dateError && (
              <div className="text-red-500 text-sm mt-1">
                {dateError}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Footer - Fixed at Bottom */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-4">
          <Button
            onClick={() => {
              setStatusFilter('all');
              setLaptopModelFilter('all');
              setDateFilter({ start: null, end: null });
              setCurrentPage(1);
            }}
            className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white py-4 text-lg rounded-2xl transition"
          >
            Clear All
          </Button>
          <Button
            onClick={() => setIsFilterOpen(false)}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 text-lg rounded-2xl transition"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  </>
)}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => handleSort('ticketNo')}
                >
                  <div className="flex items-center">
                    Ticket No
                    {getSortIcon('ticketNo')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => handleSort('laptopModel')}
                >
                  <div className="flex items-center">
                    Laptop Model
                    {getSortIcon('laptopModel')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => handleSort('subject')}
                >
                  <div className="flex items-center">
                    Subject
                    {getSortIcon('subject')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon('status')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => handleSort('createdBy')}
                >
                  <div className="flex items-center">
                    Created By
                    {getSortIcon('createdBy')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center">
                    Date
                    {getSortIcon('date')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500 dark:text-gray-400">
                    No requests found matching the criteria.
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((request) => (
                  <tr key={request.taskId} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white/90">
                        {request.requestDetails?.summitMetaData?.ticketNo || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {getLaptopModel(request)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-normal break-words">
                        {request.requestDetails?.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {request.taskStatus?.toLowerCase() === 'completed' ? (
                          <>
                            <FiCheck className="mr-2 text-green-500" />
                            <span className="text-green-600 dark:text-green-400">Completed</span>
                          </>
                        ) : request.taskStatus?.toLowerCase() === 'in progress' ? (
                          <>
                            <FiClock className="mr-2 text-blue-500" />
                            <span className="text-blue-600 dark:text-blue-400">In Progress</span>
                          </>
                        ) : request.taskStatus?.toLowerCase() === 'approved' ? (
                          <>
                            <FcApproval className="mr-2 text-green-500" />
                            <span className="text-green-600 dark:text-green-400">Approved</span>
                          </>
                        ) : (
                          <>
                            <FiClock className="mr-2 text-gray-500" />
                            <span className="text-gray-500 dark:text-gray-400">{request.taskStatus || 'Unknown'}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {request.requestDetails?.createdBy?.empName || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(request.createdDate || request.requestDetails?.createdDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <Button
                        onClick={() => setSelectedRequest(request)}
                        className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg"
                      >
                        <FcViewDetails className="text-xl" />
                      </Button>
                      {request.taskStatus?.toLowerCase() === 'in progress' && (
                        <>
                          <Button
                            onClick={() => {
                              setSelectedRequest(request);
                              setRemarks('Approved');
                            }}
                            className="p-2 bg-green-600 hover:bg-green-200 text-green-600 rounded-lg"
                          >
                            <FiCheck className="text-xl" />
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedRequest(request);
                              setRemarks('');
                            }}
                            className="p-2 bg-red-600 hover:bg-red-200 text-red-600 rounded-lg"
                          >
                            <FiX className="text-xl" />
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
        <Button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg shadow-md transition duration-300 ${currentPage === 1
            ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
            }`}
          aria-label="Go to first page"
        >
          {"<<"}
        </Button>
        <Button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg shadow-md transition duration-300 ${currentPage === 1
            ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
            }`}
          aria-label="Go to previous page"
        >
          {"<"}
        </Button>
        <span className="flex items-center gap-1 sm:gap-2 dark:text-white/40 text-sm sm:text-lg font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg shadow-md transition duration-300 ${currentPage === totalPages || totalPages === 0
            ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
            }`}
          aria-label="Go to next page"
        >
          {">"}
        </Button>
        <Button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg shadow-md transition duration-300 ${currentPage === totalPages || totalPages === 0
            ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
            }`}
          aria-label="Go to last page"
        >
          {">>"}
        </Button>
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          className="max-w-3xl rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white/90 tracking-tight">
                Request Details
              </h2>
            </div>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    Ticket Number
                  </label>
                  <p className="text-gray-900 dark:text-white/90 font-semibold text-lg">
                    {selectedRequest.requestDetails?.summitMetaData?.ticketNo || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    Status
                  </label>
                  <div className="flex items-center">
                    {selectedRequest.taskStatus?.toLowerCase() === 'completed' ? (
                      <>
                        <FiCheck className="mr-2 text-green-500" />
                        <span className="text-green-600 dark:text-green-400 font-semibold text-lg">Completed</span>
                      </>
                    ) : selectedRequest.taskStatus?.toLowerCase() === 'in progress' ? (
                      <>
                        <FiClock className="mr-2 text-blue-500" />
                        <span className="text-blue-600 dark:text-blue-400 font-semibold text-lg">In Progress</span>
                      </>
                    ) : selectedRequest.taskStatus?.toLowerCase() === 'approved' ? (
                      <>
                        <FcApproval className="mr-2 text-green-500" />
                        <span className="text-green-600 dark:text-green-400 font-semibold text-lg">Approved</span>
                      </>
                    ) : (
                      <>
                        <FiClock className="mr-2 text-gray-500" />
                        <span className="text-gray-500 dark:text-gray-400 font-semibold text-lg">{selectedRequest.taskStatus || 'Unknown'}</span>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    Laptop Model
                  </label>
                  <p className="text-gray-900 dark:text-white/90 font-semibold text-lg">
                    {getLaptopModel(selectedRequest)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    Requested By
                  </label>
                  <p className="text-gray-900 dark:text-white/90 font-semibold text-lg">
                    {selectedRequest.requestDetails?.createdBy?.empName || 'Unknown'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    Request Date
                  </label>
                  <p className="text-gray-900 dark:text-white/90 font-semibold text-lg">
                    {new Date(selectedRequest.createdDate || selectedRequest.requestDetails?.createdDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  Description
                </label>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <p className="text-gray-800 dark:text-white/90">
                    {selectedRequest.requestDetails?.subject || 'No description provided'}
                  </p>
                </div>
              </div>

              {selectedRequest.taskStatus?.toLowerCase() === 'in progress' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    {remarks === 'Approved' ? 'Approval Remarks' : 'Rejection Remarks'}
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    rows={3}
                    placeholder={remarks === 'Approved' ? 'Approval remarks...' : 'Enter reason for rejection...'}
                    disabled={remarks === 'Approved'}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
              >
                Close
              </Button>
              {selectedRequest.taskStatus?.toLowerCase() === 'in progress' && (
                <>
                  <Button
                    onClick={() => handleApproveReject(false)}
                    disabled={isProcessing || !remarks}
                    className="px-4 py-2 bg-red-600 hover:bg-red-600 text-white rounded-lg"
                  >
                    {isProcessing ? 'Processing...' : 'Reject'}
                  </Button>
                  <Button
                    onClick={() => handleApproveReject(true)}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-green-600 hover:bg-green-600 text-white rounded-lg"
                  >
                    {isProcessing ? 'Processing...' : 'Approve'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Approval Status Notification */}
      {approvalStatus.show && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 rounded-xl shadow-lg ${approvalStatus.type === 'success'
          ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400'
          : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
          }`}>
          {approvalStatus.type === 'success' ? (
            <FiCheck className="h-5 w-5" />
          ) : (
            <FiX className="h-5 w-5" />
          )}
          <span>{approvalStatus.message}</span>
        </div>
      )}
    </div>
  );
}



