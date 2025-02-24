// import React from "react";
// import { useGetDashboardDataQuery } from "../../services/grafanaApi";
// import { Container, Spinner, Alert } from "react-bootstrap";

// const Dashboard: React.FC = () => {
//   const { data, error, isLoading } = useGetDashboardDataQuery(null);

//   return (
//     <Container>
//       <h2 className="my-4">Dashboard</h2>
//       {isLoading && <Spinner animation="border" />}
//       {error && <Alert variant="danger">Error fetching dashboard</Alert>}
//       {data && <iframe src="http://localhost:3000/d-solo/your-dashboard" width="100%" height="600px" />}
//     </Container>
//   );
// };

// export default Dashboard;

import EcommerceMetrics from "../../components/dashboard/EcommerceMetrics";
import MonthlySalesChart from "../../components/dashboard/MonthlySalesChart";
import StatisticsChart from "../../components/dashboard/StatisticsChart";
import MonthlyTarget from "../../components/dashboard/MonthlyTarget";
import DemographicCard from "../../components/dashboard/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import RecentProjects from "../../components/dashboard/RecentProjects";

export default function Home() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentProjects />
        </div>
      </div>
    </>
  );
}
