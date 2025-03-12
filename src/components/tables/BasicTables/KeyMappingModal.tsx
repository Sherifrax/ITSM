import { useState, useEffect } from "react";
import Modal from "../../ui/modal";
import Button from "../../ui/button";

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
  useEffect(() => {
    if (isOpen) {
      fetchApiKeys();
      initializeSelectedKeys();
    }
  }, [isOpen, urlMappingId]);

  // Fetch all available API keys
  const fetchApiKeys = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://10.20.20.54:5259/api/keymapping/Search?urlmapping_id=${urlMappingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch API keys");

      const data = await response.json();
      setApiKeys(data);
    } catch (error) {
      console.error("Error fetching API keys:", error);
    }
  };

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
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      // Format the selected keys as a JSON string
      const apikeyJson = JSON.stringify({ apikey: selectedKeys });

      // URL-encode the JSON string
      const encodedApikey = encodeURIComponent(apikeyJson);

      // Construct the URL with query parameters
      const url = `http://10.20.20.54:5259/api/keymapping/Connect?apikey=${encodedApikey}&urlmapping_id=${urlMappingId}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response from server:", errorText);
        throw new Error(`Failed to save key mapping: ${errorText}`);
      }

      const responseData = await response.json();
      console.log("Save Key Mapping Response:", responseData);

      onClose(); // Close the modal after saving
    } catch (error) {
      console.error("Error saving key mapping:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6 dark:text-white/90">Link API Keys</h2>
        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div key={apiKey.apikey} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedKeys.includes(apiKey.apikey)}
                onChange={() => handleCheckboxChange(apiKey.apikey)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              {/* <span className="ml-2 text-gray-700">{apiKey.apikey}</span> */}
              <span className="ml-2 text-gray-700">{apiKey.clientname}</span>

            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <Button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 text-lg"
            onClick={onClose}
          >
            Cancel
          </Button>
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