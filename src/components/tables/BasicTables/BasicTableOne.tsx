import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Button from "../../ui/button";
import { Modal } from "../../ui/modal";

interface ApiKey {
  apiKey: string;
  clientName: string;
  isActive: boolean;
  isIpCheck: boolean;
  isCountryCheck: boolean;
  isRegionCheck: boolean;
}

export default function BasicTableOne({
  apiKeys,
  onDelete,
  onEdit,
}: {
  apiKeys: ApiKey[];
  onDelete: (apiKey: string) => void;
  onEdit: (apiKey: ApiKey) => void;
}) {
  const [deleteApiKey, setDeleteApiKey] = useState<string | null>(null);

  const handleDelete = () => {
    if (deleteApiKey) {
      onDelete(deleteApiKey);
      setDeleteApiKey(null);
    }
  };

  return (
    <>
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
                    Client Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Active
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    IP Check
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Country Check
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Region Check
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
                {apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.apiKey}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {apiKey.clientName}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {apiKey.isActive ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {apiKey.isIpCheck ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {apiKey.isCountryCheck ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {apiKey.isRegionCheck ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <div className="flex gap-2">
                        <Button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5"
                          onClick={() => onEdit(apiKey)}
                        >
                          Edit
                        </Button>
                        <Button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5"
                          onClick={() => setDeleteApiKey(apiKey.apiKey)}
                        >
                          Delete
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

      <Modal isOpen={deleteApiKey !== null} onClose={() => setDeleteApiKey(null)} className="max-w-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-400">Confirm Deletion</h2>
          <p className="mb-6 dark:text-red-400">Are you sure you want to delete this API key?</p>
          <div className="flex justify-end space-x-4">
            <Button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800"
              onClick={() => setDeleteApiKey(null)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}