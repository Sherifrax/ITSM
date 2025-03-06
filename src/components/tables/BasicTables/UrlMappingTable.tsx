import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Button from "../../ui/button";
import { FaRegEdit, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { useState } from "react";
import { HiOutlineLink } from "react-icons/hi";

interface UrlMapping {
  id: number;
  incomingurl: string;
  mappedurl: string;
  isactive: boolean;
}

export default function UrlMappingTable({
  urlMappings,
  onEdit,
}: {
  urlMappings: UrlMapping[];
  onEdit: (mapping: UrlMapping) => void;
}) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedUrlMappings = [...urlMappings].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = a[sortColumn as keyof UrlMapping];
    const bValue = b[sortColumn as keyof UrlMapping];

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

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
                    onClick={() => handleSort("incomingurl")}
                  >
                    Incoming URL
                    {getSortIcon("incomingurl")}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => handleSort("mappedurl")}
                  >
                    Mapped URL
                    {getSortIcon("mappedurl")}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => handleSort("isactive")}
                  >
                    Active
                    {getSortIcon("isactive")}
                  </div>
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
              {sortedUrlMappings.map((mapping, index) => (
                <TableRow key={`${mapping.id}-${index}`}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {mapping.incomingurl}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {mapping.mappedurl}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {mapping.isactive ? "Yes" : "No"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <div className="flex gap-2">
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5"
                        onClick={() => onEdit(mapping)}
                      >
                        <FaRegEdit />
                      </Button>
                      <Button
                        className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5"
                      // onClick={() => onEdit(mapping)}
                      >
<HiOutlineLink />
</Button>
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