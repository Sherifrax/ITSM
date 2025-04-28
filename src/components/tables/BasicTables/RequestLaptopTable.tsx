import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../ui/table';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { RequestLaptop } from '../../../types/requestLaptop';
import Button from '../../ui/button';

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
      return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        request.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.requestId?.toString().toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || request.requestStatus.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [requests, searchQuery, statusFilter]);

  const sortedRequests = useMemo(() => {
    if (!sortColumn) return filteredRequests;

    return [...filteredRequests].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortColumn) {
        case 'ticketNo':
          aValue = a.requestId;
          bValue = b.requestId;
          break;
        case 'subject':
          aValue = a.subject.toLowerCase();
          bValue = b.subject.toLowerCase();
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
    return <div>Loading requests...</div>;
  }

  if (requests.length === 0) {
    return <div>No requests found</div>;
  }

  return (
    <div>
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search by Ticket No or Subject..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          />
          <svg
            className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-lg py-2 px-8 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            {uniqueStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div
                    className="cursor-pointer select-none flex items-center gap-1"
                    onClick={() => handleSort('ticketNo')}
                  >
                    Ticket No {getSortIcon('ticketNo')}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div
                    className="cursor-pointer select-none flex items-center gap-1"
                    onClick={() => handleSort('subject')}
                  >
                    Subject {getSortIcon('subject')}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div
                    className="cursor-pointer select-none flex items-center gap-1"
                    onClick={() => handleSort('status')}
                  >
                    Status {getSortIcon('status')}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div
                    className="cursor-pointer select-none flex items-center gap-1"
                    onClick={() => handleSort('createdBy')}
                  >
                    Created By {getSortIcon('createdBy')}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div
                    className="cursor-pointer select-none flex items-center gap-1"
                    onClick={() => handleSort('date')}
                  >
                    Date {getSortIcon('date')}
                  </div>
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedRequests.map((request) => (
                <TableRow key={request.requestId}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start dark:text-gray-100">
                    {request.requestId}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start dark:text-gray-400">
                    {request.subject}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span
                      className={`${request.requestStatus.status.toLowerCase() === 'resolved'
                          ? 'text-green-500'
                          : request.requestStatus.status.toLowerCase() === 'in progress'
                            ? 'text-blue-500'
                            : 'text-gray-400'
                        }`}
                    >
                      {request.requestStatus.status}
                      {/* (ID: {request.requestStatus.statusId}) */}

                    </span>
                  </TableCell>

                  <TableCell className="px-5 py-4 sm:px-6 text-start dark:text-gray-400">
                    {request.createdBy.empName}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start dark:text-gray-400">
                    {new Date(request.createdDate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        <Button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="px-3 py-1"
        >
          {'<<'}
        </Button>
        <Button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1"
        >
          {'<'}
        </Button>
        <span className="flex items-center gap-2 dark:text-white/40 text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1"
        >
          {'>'}
        </Button>
        <Button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1"
        >
          {'>>'}
        </Button>
      </div>
    </div>
  );
}
