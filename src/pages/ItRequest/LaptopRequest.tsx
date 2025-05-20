import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { requestLaptopApi } from '../../services/requestLaptop';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import RequestLaptopForm from "../../components/tables/BasicTables/LaptopRequest";
import ComponentCard from "../../components/common/ComponentCard";

export default function RequestLaptop() {
  const currentUser = {
    empNumber: 'TR100958',
    empName: 'Nabeel Hashim',
    email: "nabeel.h@trojan.ae"
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <>
      <PageMeta title="Request Laptop" description="" />
      {/* <PageBreadcrumb pageTitle="Laptop Request" /> */}
      {/* <div className="space-y-6 p-6 bg-white rounded-2xl shadow-lg dark:bg-gray-900"> */}
      <div className="space-y-6">
        <ComponentCard 
          title="New Laptop Request" 
          className="shadow-xl rounded-3xl border border-gray-200 dark:border-gray-700"
        >
          <RequestLaptopForm 
            currentUser={currentUser}
            onSuccess={() => {
              dispatch(requestLaptopApi.util.resetApiState());
              navigate('/home');
            }}
          />
        </ComponentCard>
      </div>
    </>
  );
}
