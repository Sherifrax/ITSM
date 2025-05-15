// src/components/RequestLaptopForm.tsx
import React, { useState } from 'react';
import { useCreateLaptopRequestMutation } from '../../../services/requestLaptop';
import { 
  RequestType, 
  SummitAiCustomFieldGroup, 
  SummitAiCustomFieldName,
  Employee
} from '../../../types/requestLaptop';
import { FiLoader, FiCheck, FiX, FiChevronDown, FiInfo } from 'react-icons/fi';
import Button from '../../ui/button';

const LAPTOP_MODELS = [
  'XPS-15-Ultrabook',
  'Latitude-E5550',
  'Probook-450-G4',
  'Zbook17-G3',
  'Latitude-E5580',
  'Probook-450-G5',
  'Precision-5530',
  'Precision-7530-CTO'
];

const MODEL_DESCRIPTIONS: Record<string, string> = {
  'XPS-15-Ultrabook': 'High-performance ultrabook with 4K display',
  'Latitude-E5550': 'Business-class laptop with enterprise features',
  'Probook-450-G4': 'Reliable workhorse with excellent keyboard',
  'Zbook17-G3': 'Mobile workstation for creative professionals',
  'Latitude-E5580': 'Durable business laptop with security features',
  'Probook-450-G5': 'Updated version with improved performance',
  'Precision-5530': 'Powerful mobile workstation with NVIDIA graphics',
  'Precision-7530-CTO': 'Customizable high-end workstation'
};

interface RequestLaptopFormProps {
  currentUser: Employee;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function RequestLaptopForm({ currentUser, onSuccess, onCancel }: RequestLaptopFormProps) {
  const [selectedModel, setSelectedModel] = useState('');
  const [description, setDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [createLaptopRequest, { isLoading, isSuccess, isError, reset }] = useCreateLaptopRequestMutation();

  // src/components/RequestLaptopForm.tsx
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      // Create the request data object
      const requestData = {
        createdBy: {
          empNumber: currentUser.empNumber,
          empName: currentUser.empName,
          email: currentUser.email
        },
        createdFor: {
          empNumber: currentUser.empNumber,
          empName: currentUser.empName,
          email: currentUser.email
        },
        // subject: `Laptop Request - ${selectedModel}`,
        subject: `${description}`,
        requestTypeId: "1",
        summitMetaData: {
          summitAiCustomFields: [
            {
              GroupName: "Request Details",
              AttributeName: "Model",
              AttributeValue: selectedModel
            }
          ]
        }
      };
  
      // Append the data to formData
      formData.append('mrRequestData', JSON.stringify(requestData));
      
      // If you have a file to upload, append it like this:
      // formData.append('file', fileObject);
  
      console.log('Submitting payload:', requestData);
  
      await createLaptopRequest(formData).unwrap();
      setSelectedModel('');
      setDescription('');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSuccess?.();
      }, 2000);
      
    } catch (error) {
      console.error('Request failed:', error);
      setTimeout(reset, 3000);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">New Laptop Request</h2>
        
        <div className="mb-1 flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Laptop Model <span className="text-red-500">*</span>
          </label>
          {selectedModel && MODEL_DESCRIPTIONS[selectedModel] && (
            <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
              <FiInfo className="mr-1" />
              {MODEL_DESCRIPTIONS[selectedModel]}
            </span>
          )}
        </div>
        
        <div className="relative">
          <select
            value={selectedModel}
            onChange={(e) => {
              setSelectedModel(e.target.value);
              reset(); // Clear any previous error/success states
            }}
            className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white dark:bg-gray-700 dark:text-white appearance-none"
            required
          >
            <option value="">Select a laptop model</option>
            {LAPTOP_MODELS.map(model => (
              <option key={model} value={model} className="dark:bg-gray-700">
                {model}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Please describe your requirements, including any special configurations needed.
        </p>
        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            reset(); // Clear any previous error/success states
          }}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white dark:bg-gray-700 dark:text-white"
          rows={4}
          placeholder="Example: Need this for graphic design work, require high color accuracy display..."
          required
        />
      </div>

      <div className="mb-4 transition-all duration-300">
        {showSuccess && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-sm animate-fade-in">
            <FiCheck className="h-4 w-4 flex-shrink-0" />
            <span>Request submitted successfully! Redirecting...</span>
          </div>
        )}
        {isError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm animate-fade-in">
            <FiX className="h-4 w-4 flex-shrink-0" />
            <span>Error submitting request. Please try again.</span>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        {onCancel && (
          <Button
            // type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-lg transition-colors"
          >
            Cancel
          </Button>
        )}
        <Button
          // type="submit"
          disabled={isLoading || !selectedModel || !description}
          className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-all ${
            isLoading || !selectedModel || !description
              ? 'bg-blue-400 dark:bg-blue-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-md hover:shadow-lg'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <FiLoader className="animate-spin mr-2" />
              Processing...
            </span>
          ) : (
            'Submit Request'
          )}
        </Button>
      </div>
    </form>
  );
}