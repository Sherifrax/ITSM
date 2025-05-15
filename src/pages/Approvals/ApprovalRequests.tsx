// src/pages/ApprovalPage.tsx
import React from 'react';
import { useGetAssignedRequestsQuery } from '../../services/requestLaptop';
import ApprovalRequestTable from '../../components/tables/BasicTables/ApprovalRequests';
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function ApprovalPage() {
  // Get current user from your auth context
  const currentUser = {
    empNumber: 'TR100958', // Replace with dynamic value
    empName: 'Nabeel Hashim',
    email: 'nabeel.h@trojan.ae'
  };

  const { data: requests = [], isLoading, error, refetch } = useGetAssignedRequestsQuery(currentUser.empNumber);

  if (error) {
    console.error('Error fetching approval requests:', error);
    return <div>Error loading approval requests. Please try again.</div>;
  }

  return (
    <>
      <PageMeta title="Approvals" description="Pending approval requests" />
      {/* <PageBreadcrumb pageTitle="Pending Laptop Approvals" /> */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <ComponentCard title="Pending Laptop Approvals">
            <ApprovalRequestTable 
              requests={requests}
              isLoading={isLoading}
              refetch={refetch}
            />
          </ComponentCard>
        </div>
      </div>
    </>
  );
}