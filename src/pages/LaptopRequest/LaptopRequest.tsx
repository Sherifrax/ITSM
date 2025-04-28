import React from 'react';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import RequestLaptopForm from "../../components/tables/BasicTables/RequestLaptopForm";
import ComponentCard from "../../components/common/ComponentCard";

export default function RequestLaptop() {
  const currentUser = {
    empNumber: 'TR100958',
    empName: 'Nabeel Hashim',
    email: "nabeel.h@trojan.ae"
  };

  return (
    <>
      <PageMeta title="Request Laptop" description="" />
      <PageBreadcrumb pageTitle="Laptop Request" />
      <div className="space-y-4">
        <ComponentCard title="Request Details">
          <RequestLaptopForm 
            currentUser={currentUser}
            // onSuccess={() => alert('Request submitted successfully! Refresh to see it in your list.')}
          />
        </ComponentCard>
      </div>
    </>
  );
}