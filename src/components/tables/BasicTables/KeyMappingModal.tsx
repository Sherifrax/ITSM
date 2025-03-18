import { useState, useEffect } from "react";
import Modal from "../../ui/modal";
import Button from "../../ui/button";
import { useFetchApiKeysQuery } from "../../../services/keyMapping/search";
import { useSaveKeyMappingMutation } from "../../../services/keyMapping/save";

interface ApiKey {
  apikey: string;
  clientname: string;
}

interface KeyMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  urlMappingId: number;
}

const KeyMappingModal: React.FC<KeyMappingModalProps> = ({ isOpen, onClose, urlMappingId }) => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  // Local storage key for persisting selected keys
  const localStorageKey = `selectedKeys_${urlMappingId}`;

  // Fetch API keys and initialize selectedKeys from local storage when the modal opens
  const { data: fetchedApiKeys} = useFetchApiKeysQuery({ urlmapping_id: urlMappingId });
  // const { data: fetchedApiKeys, isLoading } = useFetchApiKeysQuery({ urlmapping_id: urlMappingId });

  useEffect(() => {
    if (fetchedApiKeys) {
      setApiKeys(fetchedApiKeys);
    }
  }, [fetchedApiKeys]);

  useEffect(() => {
    if (isOpen) {
      initializeSelectedKeys();
    }
  }, [isOpen, urlMappingId]);

  // Initialize selectedKeys from local storage
  const initializeSelectedKeys = () => {
    const savedSelectedKeys = localStorage.getItem(localStorageKey);
    if (savedSelectedKeys) {
      setSelectedKeys(JSON.parse(savedSelectedKeys));
    }
  };

  // Handle checkbox selection
  const handleCheckboxChange = (apikey: string) => {
    const updatedSelectedKeys = selectedKeys.includes(apikey)
      ? selectedKeys.filter((key) => key !== apikey) // Remove key if already selected
      : [...selectedKeys, apikey]; // Add key if not selected

    setSelectedKeys(updatedSelectedKeys);

    // Save updated selected keys to local storage
    localStorage.setItem(localStorageKey, JSON.stringify(updatedSelectedKeys));
  };

  // Save selected API keys
  const [saveKeyMapping] = useSaveKeyMappingMutation();
  const handleSave = async () => {
    try {
      // Prepare the payload as required by the API
      const payload = {
        apikeyList: selectedKeys, // Pass the array directly
        urlmapping_id: urlMappingId,
      };

      // Call the save API
      await saveKeyMapping(payload).unwrap();


      onClose(); // Close the modal after saving
    } catch (error) {
      console.error("Error saving key mapping:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6 dark:text-white/90">Link API Keys</h2>
        <div className="space-y-4 max-h-96 overflow-y-auto"> {/* Scrollable container */}
          {apiKeys.map((apiKey) => (
            <div key={apiKey.apikey} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedKeys.includes(apiKey.apikey)}
                onChange={() => handleCheckboxChange(apiKey.apikey)}
                className="ml-2 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-white/90">{apiKey.apikey}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          {/* <Button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 text-lg"
            onClick={onClose}
          >
            Cancel
          </Button> */}
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 text-lg"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default KeyMappingModal;