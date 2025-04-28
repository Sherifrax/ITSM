// src/pages/Dashboard.tsx
import React from 'react';
import { useGetRequestsByCreatorQuery } from '../../services/requestLaptop';
import RequestLaptopTable from '../../components/tables/BasicTables/RequestLaptopTable';
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";

export default function Dashboard() {
  // Get current user from your auth context
  const currentUser = {
    empNumber: 'TR100958', // Replace with dynamic value
    empName: 'Nabeel Hashim',
    email: 'nabeel.h@trojan.ae'
  };

  const { data: requests = [], isLoading, error } = useGetRequestsByCreatorQuery(currentUser.empNumber);

  if (error) {
    console.error('Error fetching requests:', error);
    return <div>Error loading requests. Please try again.</div>;
  }

  return (
    <>
      <PageMeta title="Dashboard" description="Your laptop requests" />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <ComponentCard title="My Laptop Requests">
            <RequestLaptopTable 
              requests={requests}
              isLoading={isLoading}
            />
          </ComponentCard>
        </div>
      </div>
    </>
  );
}