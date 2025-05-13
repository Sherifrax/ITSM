import React from 'react';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import RequestLaptopForm from "../../components/tables/BasicTables/RequestLaptopForm";
import ComponentCard from "../../components/common/ComponentCard";

export default function RequestLaptop() {
  const currentUser = {
    empNumber: 'TR100958',
    empName: 'Abdalrahman Sherif Ibrahim Rashad Elsaid',
    email: "nabeel.h@trojan.ae"
  };

  return (
    <>
      <PageMeta title="Request Laptop" description="" />
      <PageBreadcrumb pageTitle="Laptop Request" />
      {/* <div className="space-y-6 p-6 bg-white rounded-2xl shadow-lg dark:bg-gray-900"> */}
      <div className="space-y-6">
        <ComponentCard 
          title="Request Details" 
          className="shadow-xl rounded-3xl border border-gray-200 dark:border-gray-700"
        >
          <RequestLaptopForm 
            currentUser={currentUser}
            // onSuccess={() => alert('Request submitted successfully! Refresh to see it in your list.')}
          />
        </ComponentCard>
      </div>
    </>
  );
}