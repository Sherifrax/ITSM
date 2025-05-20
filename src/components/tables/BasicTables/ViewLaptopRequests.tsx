import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../ui/table';
import { FiArrowUp, FiArrowDown, FiSearch, FiX, FiCheck, FiClock } from 'react-icons/fi';
import { IconType } from 'react-icons';
import { RequestLaptop } from '../../../types/requestLaptop';
import Button from '../../ui/button';
import { Modal } from '../../ui/modal';
import { FcViewDetails } from "react-icons/fc";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FcApproval } from "react-icons/fc";
import { AiTwotoneNotification } from "react-icons/ai";

interface RequestLaptopTableProps {
  requests: RequestLaptop[];
  isLoading?: boolean;
}

type SortDirection = 'asc' | 'desc';

export default function RequestLaptopTable({ requests, isLoading }: RequestLaptopTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ticketStatusFilter, setTicketStatusFilter] = useState<string>('all');
  const [laptopModelFilter, setLaptopModelFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<{ start: Date | null, end: Date | null }>({ start: null, end: null });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<RequestLaptop | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const itemsPerPage = 8;

  // Helper function to render ITSM ticket status with icon and color
  const renderTicketStatus = (status: string | undefined | null) => {
    if (!status) {
      return (
        <span className="text-gray-500 dark:text-gray-400">N/A</span>
      );
    }

    const lowerStatus = status.toLowerCase();

    let Icon: IconType = FiClock;
    let colorClass = 'text-gray-500';
    let textClass = 'text-gray-500 dark:text-gray-400';
    let label = status;

    if (lowerStatus === 'open' || lowerStatus === 'new') {
      Icon = AiTwotoneNotification  ;
      colorClass = 'text-blue-500';
      textClass = 'text-blue-600 dark:text-blue-400';
    } else if (lowerStatus === 'in-progress') {
      Icon = FiClock;
      colorClass = 'text-blue-500';
      textClass = 'text-blue-600 dark:text-blue-400';
    } else if (lowerStatus === 'resolved' || lowerStatus === 'closed') {
      Icon = FiCheck;
      colorClass = 'text-green-500';
      textClass = 'text-green-600 dark:text-green-400';
    } else if (lowerStatus === 'rejected' || lowerStatus === 'cancelled' || lowerStatus === 'canceled') {
      Icon = FiX;
      colorClass = 'text-red-500';
      textClass = 'text-red-600 dark:text-red-400';
    } else if (lowerStatus === 'pending') {
      Icon = FiClock;
      colorClass = 'text-yellow-500';
      textClass = 'text-yellow-600 dark:text-yellow-400';
    }

    return (
      <>
        <Icon className={`mr-2 ${colorClass}`} />
        <span className={textClass}>{label}</span>
      </>
    );
  };

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

  const getLaptopModel = (request: RequestLaptop): string => {
    const modelField = request.summitMetaData?.summitAiCustomFields?.find(
      (field) => field.AttributeName === 'Model'
    );
    return modelField?.AttributeValue || 'N/A';
  };

  const uniqueLaptopModels = useMemo(() => {
    const models = requests
      .map((r) => getLaptopModel(r))
      .filter((model) => model !== 'N/A');
    return Array.from(new Set(models));
  }, [requests]);

  const uniqueTicketStatuses = useMemo(() => {
    const statuses = requests
      .map((r) => r.summitMetaData?.status)
      .filter((status): status is string => status !== undefined && status !== null);
    return Array.from(new Set(statuses));
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        request.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (request.summitMetaData?.ticketNo?.toString() || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || request.requestStatus.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesTicketStatus =
        ticketStatusFilter === 'all' || (request.summitMetaData?.status?.toLowerCase() || '') === ticketStatusFilter.toLowerCase();

      const matchesLaptopModel =
        laptopModelFilter === 'all' || getLaptopModel(request).toLowerCase() === laptopModelFilter.toLowerCase();

      // Date filter logic
      const requestDate = new Date(request.createdDate);
      const matchesDate =
        (!dateFilter.start || requestDate >= new Date(dateFilter.start)) &&
        (!dateFilter.end || requestDate <= new Date(new Date(dateFilter.end).setHours(23, 59, 59, 999)));

      return matchesSearch && matchesStatus && matchesTicketStatus && matchesLaptopModel && matchesDate;
    });
  }, [requests, searchQuery, statusFilter, ticketStatusFilter, laptopModelFilter, dateFilter.start, dateFilter.end]);

  const sortedRequests = useMemo(() => {
    if (!sortColumn) return filteredRequests;

    return [...filteredRequests].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortColumn) {
        case 'requestId':
          aValue = a.requestId || '';
          bValue = b.requestId || '';
          break;
        case 'ticketNo':
          aValue = a.summitMetaData?.ticketNo || 0;
          bValue = b.summitMetaData?.ticketNo || 0;
          break;
        case 'ticketStatus':
          aValue = a.summitMetaData?.status?.toLowerCase() || '';
          bValue = b.summitMetaData?.status?.toLowerCase() || '';
          break;
        case 'subject':
          aValue = a.subject.toLowerCase();
          bValue = b.subject.toLowerCase();
          break;
        case 'laptopModel':
          aValue = getLaptopModel(a).toLowerCase();
          bValue = getLaptopModel(b).toLowerCase();
          break;
        case 'status':
          aValue = a.requestStatus.status.toLowerCase();
          bValue = b.requestStatus.status.toLowerCase();
          break;
        case 'createdBy':
          aValue = a.createdBy.empName.toLowerCase();
          bValue = b.createdBy.empName.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.createdDate).getTime();
          bValue = new Date(b.createdDate).getTime();
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

  const uniqueStatuses = useMemo(() => {
    const statuses = requests.map((r) => r.requestStatus.status);
    return Array.from(new Set(statuses));
  }, [requests]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        No requests found
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
                  ITSM Ticket Status
                </h4>
                <select
                  value={ticketStatusFilter}
                  onChange={(e) => {
                    setTicketStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full p-4 border border-gray-300 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="all">All Ticket Statuses</option>
                  {uniqueTicketStatuses.map((status) => (
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
                  onClick={() => handleSort('requestId')}
                >
                  <div className="flex items-center">
                    Request ID
                    {getSortIcon('requestId')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => handleSort('ticketNo')}
                >
                  <div className="flex items-center">
                    ITSM Ticket No
                    {getSortIcon('ticketNo')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => handleSort('ticketStatus')}
                >
                  <div className="flex items-center">
                    ITSM Ticket Status
                    {getSortIcon('ticketStatus')}
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
                  <tr
                    key={request.requestId}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white/90">
                        {request.requestId || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white/90">
                        {request.summitMetaData?.ticketNo || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white/90 flex items-center">
                        {renderTicketStatus(request.summitMetaData?.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {getLaptopModel(request)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-normal break-words">
                        {request.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {request.requestStatus.status.toLowerCase() === 'resolved' ? (
                          <>
                            <FiCheck className="mr-2 text-green-500" />
                            <span className="text-green-600 dark:text-green-400">Resolved</span>
                          </>
                        ) : request.requestStatus.status.toLowerCase() === 'in progress' ? (
                          <>
                            <FiClock className="mr-2 text-blue-500" />
                            <span className="text-blue-600 dark:text-blue-400">In Progress</span>
                          </>
                        )
                          : request.requestStatus.status.toLowerCase() === 'approved' ? (
                            <>
                              <FcApproval className="mr-2 text-green-500" />
                              <span className="text-green-600 dark:text-green-400">Approved</span>
                            </>
                          )
                            : (
                              <>
                                <FiClock className="mr-2 text-gray-500" />
                                <span className="text-gray-500 dark:text-gray-400">{request.requestStatus.status}</span>
                              </>
                            )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {request.createdBy.empName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(request.createdDate).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        onClick={() => setSelectedRequest(request)}
                      >
                        <FcViewDetails className="text-xl" />
                      </Button>
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
                    Request ID
                  </label>
                  <p className="text-gray-900 dark:text-white/90 font-semibold text-lg">
                    {selectedRequest.requestId || 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    Status
                  </label>
                  <div className="flex items-center">
                    {selectedRequest.requestStatus.status.toLowerCase() === 'resolved' ? (
                      <>
                        <FiCheck className="mr-2 text-green-500" />
                        <span className="text-green-600 dark:text-green-400 font-semibold text-lg">Resolved</span>
                      </>
                    ) : selectedRequest.requestStatus.status.toLowerCase() === 'in progress' ? (
                      <>
                        <FiClock className="mr-2 text-blue-500" />
                        <span className="text-blue-600 dark:text-blue-400 font-semibold text-lg">In Progress</span>
                      </>
                    )

                      : selectedRequest.requestStatus.status.toLowerCase() === 'approved' ? (
                        <>
                          <FcApproval className="mr-2 text-green-500" />
                          <span className="text-green-600 dark:text-green-400 font-semibold text-lg">Approved</span>
                        </>
                      ) : (
                        <>
                          <FiClock className="mr-2 text-gray-500" />
                          <span className="text-gray-500 dark:text-gray-400 font-semibold text-lg">{selectedRequest.requestStatus.status}</span>
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
                    {selectedRequest.createdBy.empName}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    Request Date
                  </label>
                  <p className="text-gray-900 dark:text-white/90 font-semibold text-lg">
                    {new Date(selectedRequest.createdDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    ITSM Ticket No.
                  </label>
                  <p className="text-gray-900 dark:text-white/90 font-semibold text-lg">
                    {selectedRequest.summitMetaData?.ticketNo || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    ITSM Status.
                  </label>
                  <div className="flex items-center text-lg font-semibold">
                    {renderTicketStatus(selectedRequest.summitMetaData?.status)}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  Description
                </label>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <p className="text-gray-800 dark:text-white/90">
                    {selectedRequest.subject || 'No description provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}