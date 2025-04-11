import { useState, useEffect } from "react";
import Modal from "../../ui/modal";
import Button from "../../ui/button";
import { useFetchApiKeysQuery } from "../../../services/keyMapping/search";
import { useSaveKeyMappingMutation } from "../../../services/keyMapping/save";
import { FiSearch, FiCheck, FiLoader, FiSave } from "react-icons/fi";

interface ApiKey {
  apikey: string;
  clientName: string;
}

interface KeyMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  urlMappingId: number;
}

const KeyMappingModal: React.FC<KeyMappingModalProps> = ({ isOpen, onClose, urlMappingId }) => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [filteredApiKeys, setFilteredApiKeys] = useState<ApiKey[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [initialSelectedKeys, setInitialSelectedKeys] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  // Local storage key for persisting selected keys
  const localStorageKey = `selectedKeys_${urlMappingId}`;

  const { data: fetchedApiKeys } = useFetchApiKeysQuery({ urlmapping_id: urlMappingId });

  useEffect(() => {
    if (fetchedApiKeys) {
      setApiKeys(fetchedApiKeys);
    }
  }, [fetchedApiKeys]);

  useEffect(() => {
    if (isOpen) {
      initializeSelectedKeys();
      setSearchTerm("");
      setSaveStatus("idle");
    }
  }, [isOpen, urlMappingId]);

  // Filter and sort API keys based on search term and selection
  useEffect(() => {
    const filtered = apiKeys.filter((key) =>
      key.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      key.apikey.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort with selected items first
    const sorted = [...filtered].sort((a, b) => {
      const aSelected = selectedKeys.includes(a.apikey);
      const bSelected = selectedKeys.includes(b.apikey);
      return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
    });

    setFilteredApiKeys(sorted);
  }, [apiKeys, searchTerm, selectedKeys]);

  // Initialize selectedKeys from local storage
  const initializeSelectedKeys = () => {
    const savedSelectedKeys = localStorage.getItem(localStorageKey);
    const keys = savedSelectedKeys ? JSON.parse(savedSelectedKeys) : [];
    setSelectedKeys(keys);
    setInitialSelectedKeys(keys);
  };

  // Handle checkbox selection
  const handleCheckboxChange = (apikey: string) => {
    const updatedSelectedKeys = selectedKeys.includes(apikey)
      ? selectedKeys.filter((key) => key !== apikey)
      : [...selectedKeys, apikey];

    setSelectedKeys(updatedSelectedKeys);
  };

  // Save selected API keys
  const [saveKeyMapping] = useSaveKeyMappingMutation();
  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      const payload = {
        apikeyList: selectedKeys,
        urlmappingId: urlMappingId,
      };
  
      await saveKeyMapping(payload).unwrap();
      localStorage.setItem(localStorageKey, JSON.stringify(selectedKeys));
      setSaveStatus("success");
      setTimeout(() => onClose(), 3000); // Close after success
    } catch (error) {
      console.error("Error saving key mapping:", error);
      setSaveStatus("error");
    }
  };

  // Reset to initial state when closing without saving
  const handleClose = () => {
    setSelectedKeys(initialSelectedKeys);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 dark:text-white/90">Link API Keys</h2>
        
        {/* Search input */}
        <div className="relative mb-4 mt-10">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search API keys..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* API keys list */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredApiKeys.length === 0 ? (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              {searchTerm ? "No matching API keys found" : "No API keys available"}
            </div>
          ) : (
            filteredApiKeys.map((apiKey) => (
              <div 
                key={apiKey.apikey} 
                className={`flex items-center p-3 rounded-md transition-colors ${selectedKeys.includes(apiKey.apikey) 
                  ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800" 
                  : "hover:bg-gray-50 dark:hover:bg-gray-700"}`}
              >
                <input
                  type="checkbox"
                  checked={selectedKeys.includes(apiKey.apikey)}
                  onChange={() => handleCheckboxChange(apiKey.apikey)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:border-gray-600"
                />
                <div className="ml-3">
                  <div className="text-gray-800 dark:text-white/90 font-medium">{apiKey.clientName}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate">{apiKey.apikey}</div>
                </div>
                {selectedKeys.includes(apiKey.apikey) && (
                  <FiCheck className="ml-auto text-green-500" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Status and action buttons */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm">
            {saveStatus === "success" && (
              <span className="text-green-600 dark:text-green-400 flex items-center">
                <FiCheck className="mr-1" /> Saved successfully!
              </span>
            )}
            {saveStatus === "error" && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm mt-1">
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
  <span>Please select at least one API Key to map before saving.</span>
</div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={saveStatus === "saving"}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saveStatus === "saving"}
              className="min-w-24"
            >
              {saveStatus === "saving" ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
              
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default KeyMappingModal;