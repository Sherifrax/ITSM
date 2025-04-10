import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useGetMonthStatusHitQuery } from "../../services/Dashboard/dashboard.service";
import { format, parse } from "date-fns";

export default function RequestTableData() {
  const { data: statusHits } = useGetMonthStatusHitQuery();

  // Process the data to group by month and status
  const processChartData = () => {
    if (!statusHits || statusHits.length === 0) {
      return {
        categories: [],
        series: []
      };
    }

    // Get unique months from the data
    const months = [...new Set(statusHits.map(item => item.monthYear))];
    const sortedMonths = months.sort((a, b) => {
      const dateA = parse(a, "MMM-yyyy", new Date());
      const dateB = parse(b, "MMM-yyyy", new Date());
      return dateA.getTime() - dateB.getTime();
    });

    // Get unique status codes
    const statusCodes = [...new Set(statusHits.map(item => item.statusCode))];
    
    // Prepare series data for each status code
    const series = statusCodes.map(statusCode => {
      const statusData = statusHits.find(item => item.statusCode === statusCode);
      return {
        name: statusData?.status || `Status ${statusCode}`,
        data: sortedMonths.map(month => {
          const monthData = statusHits.find(item => 
            item.monthYear === month && item.statusCode === statusCode
          );
          return monthData?.hitCount || 0;
        })
      };
    });

    // Format month names for display (e.g., "Mar-2025" to "Mar")
    const categories = sortedMonths.map(month => 
      format(parse(month, "MMM-yyyy", new Date()), "MMM")
    );

    return {
      categories,
      series
    };
  };

  const { categories, series } = processChartData();

  const options: ApexOptions = {
    legend: {
      show: true, // Show legend to differentiate status codes
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#9CB9FF", "#FF6384", "#36A2EB", "#FFCE56"], // Different colors for status codes
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      width: [2, 2, 2, 2, 2], // Consistent line width
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      x: {
        formatter: function(val, opts) {
          // Show full month-year in tooltip
          const fullMonth = statusHits?.find(item => 
            format(parse(item.monthYear, "MMM-yyyy", new Date()), "MMM") === String(val)
          )?.monthYear || String(val);
          return fullMonth;
        }
      },
      y: {
        formatter: (val: number) => `${val} requests`,
      },
    },
    xaxis: {
      type: "category",
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
      title: {
        text: "",
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Request Data by Status
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Monthly request counts by HTTP status
          </p>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          {statusHits ? (
            <Chart options={options} series={series} type="area" height={310} />
          ) : (
            <div className="h-[310px] flex items-center justify-center">
              Loading request data...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}