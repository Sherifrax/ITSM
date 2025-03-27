import {
} from "../../icons";
import { ImBlocked } from "react-icons/im";
import { useGetDashboardApiCountQuery } from "../../services/Dashboard/dashboard.service";

export default function totalBlockedIP() {
  const { data} = useGetDashboardApiCountQuery();
  const totalBlockedIP = data?.[0]?.totalBlockedIP ?? 0;

  return (
    <>
      {/* <!-- Total Blocked Ip --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <ImBlocked className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Blocked IP
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {totalBlockedIP}
            </h4>
          </div>
        </div>
      </div>
    </>
  );
}
