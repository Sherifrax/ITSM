import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { FaSort, FaSortUp, FaSortDown, FaHistory } from "react-icons/fa";
import Button from "../../ui/button";
import { FcViewDetails } from "react-icons/fc";
import { CgUnblock } from "react-icons/cg";

interface IPRateLimit {
  iPaddress: string;
  requestCount: number;
  lastRequestTime: string;
  isblocked: boolean;
}

interface IPRateLimitTableProps {
  ipRateLimits: IPRateLimit[];
  onViewHistory: (ipAddress: string) => void;
  onUnblock: (ipAddress: string, comment: string) => void;
}

export default function IPRateLimitTable({
  ipRateLimits,
  onViewHistory,
  onUnblock,
}: IPRateLimitTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [comment, setComment] = useState<string>("");

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Sort IP rate limits
  const sortedIPRateLimits = [...ipRateLimits].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = a[sortColumn as keyof IPRateLimit];
    const bValue = b[sortColumn as keyof IPRateLimit];

    if (aValue === null) return sortDirection === "asc" ? -1 : 1;
    if (bValue === null) return sortDirection === "asc" ? 1 : -1;
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Get sort icon
  const getSortIcon = (column: string) => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => handleSort("iPaddress")}
                  >
                    IP Address
                    {getSortIcon("iPaddress")}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Request Count
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Last Request Time
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {sortedIPRateLimits.map((limit) => (
                <TableRow key={limit.iPaddress}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {limit.iPaddress}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {limit.requestCount}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {new Date(limit.lastRequestTime).toLocaleString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {limit.isblocked ? "Blocked" : "Unblocked"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex gap-2">
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5"
                        onClick={() => onViewHistory(limit.iPaddress)}
                      >
                        <FaHistory/>
                      </Button>
                      {limit.isblocked && <Button
                        // className={`${
                        //   limit.isblocked
                        //     ? "bg-red-500 hover:bg-red-600"
                        //     : "bg-gray-300 cursor-not-allowed"
                        // } text-white px-3 py-1.5`}
                        onClick={() => onUnblock(limit.iPaddress, comment)}
                        disabled={!limit.isblocked}
                      >
                        <CgUnblock />
                      </Button>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}