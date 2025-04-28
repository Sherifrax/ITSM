import React, { useState } from 'react';
import { useCreateLaptopRequestMutation } from '../../../services/requestLaptop';
import { FiLoader, FiCheck, FiX } from 'react-icons/fi';
import Button from '../../ui/button';

interface RequestLaptopFormProps {
  currentUser: {
    empNumber: string;
    empName: string;
    email: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function RequestLaptopForm({ currentUser, onSuccess, onCancel }: RequestLaptopFormProps) {
  const [laptopModel, setLaptopModel] = useState('');
  const [description, setDescription] = useState('');
  const [createLaptopRequest, { isLoading, isSuccess, isError }] = useCreateLaptopRequestMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Complete payload matching EXACT Swagger specification
      const payload = {
        createdBy:   {
          empNumber: "TR100958",
          empName: "Abdalrahman Sherif",
          email: "nabeel.h@trojan.ae"
        },
        createdFor: {
          empNumber: "TR100958",
          empName: "Abdalrahman Sherif",
          email: "nabeel.h@trojan.ae"
        },
        subject: `Laptop Request: ${laptopModel}`,
        requestType: "1",
        // These fields are in the successful response
        summitMetaData: {
          ticketNo: 0, // Required field, set to 0 for new requests
          message: "", // Empty for new requests
          summitAiCustomFields: [
            {
              GroupName: "Request Details", // Must match exactly
              AttributeName: "Model",
              AttributeValue: "EliteBook 840"
            },
            // {
            //   GroupName: "Request Details",
            //   AttributeName: "Description",
            //   AttributeValue: description
            // }
          ]
        },
        // These fields are in the successful response
        // responseStatus: {
        //   status: "SUCCESS",
        //   message: "Request submitted"
        // }
      };

      console.log("Final payload being sent:", JSON.stringify(payload, null, 2));
      
      const result = await createLaptopRequest(payload).unwrap();
      console.log("Request successful:", result);
      
      setLaptopModel('');
      setDescription('');
      onSuccess?.();
      
    } catch (error: any) {
      console.error('Full error:', error);
      if (error.data) {
        console.error('Server response:', error.data);
        alert(`Error: ${error.status} - ${JSON.stringify(error.data)}`);
      } else {
        alert('Request failed. Please check console for details.');
      }
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div>
        <label className="block text-sm font-medium mb-2 dark:text-gray-400">Laptop Model</label>
        <input
          type="text"
          value={laptopModel}
          onChange={(e) => setLaptopModel(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
          placeholder="e.g., Dell XPS 15"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2 dark:text-gray-400">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
          rows={4}
          placeholder="Describe your requirements..."
          required
        />
      </div>

      {/* Status message */}
      <div className="mb-4">
        {isSuccess && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
            <FiCheck className="h-4 w-4" />
            <span>Request submitted successfully!</span>
          </div>
        )}
        {isError && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
            <FiX className="h-4 w-4" />
            <span>Error submitting request. Please try again.</span>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <Button
            // type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 text-lg"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button
          // type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 text-lg min-w-24"
          disabled={isLoading || !laptopModel || !description}
        >
          {isLoading ? (
            <>
              <FiLoader className="animate-spin mr-2 inline" />
              Submitting...
            </>
          ) : (
            "Submit Request"
          )}
        </Button>
      </div>
    </form>
  );
}