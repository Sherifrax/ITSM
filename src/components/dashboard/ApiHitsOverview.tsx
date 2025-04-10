import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useGetDailyHitQuery } from "../../services/Dashboard/dashboard.service";
import { format, parse } from "date-fns";

export default function ApiHitsOverview() {
  const { data: dailyHits } = useGetDailyHitQuery();
  
  // Process the data to match the chart format
  const processChartData = () => {
    if (!dailyHits || dailyHits.length === 0) {
      return {
        categories: [],
        seriesData: []
      };
    }

    // Take the last 15 days (API returns newest first) and reverse to show chronological order
    const last15Days = dailyHits.slice(0, 15).reverse();
    
    // Format labels to show "Day\nDate" (e.g., "Mon\nMar 20")
    const categories = last15Days.map(item => {
      const date = parse(item.requestDate, "dd/MM/yyyy", new Date());
      return `${format(date, "EEE")}\n${format(date, "MMM d")}`;
    });
    
    // Extract hit counts
    const seriesData = last15Days.map(item => item.hitCount);

    return {
      categories,
      seriesData
    };
  };

  const { categories, seriesData } = processChartData();

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          fontSize: '10px',
          fontFamily: 'Outfit, sans-serif',
        },
        formatter: function(value) {
          // Split the value into day and date parts
          const [day, date] = value.split('\n');
          return `${date}`;
        }
      }
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val} hits`,
      },
    },
  };

  const series = [
    {
      name: "API Hits",
      data: seriesData,
    },
  ];
  
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          API Hits Overview (Last 15 Days)
        </h3>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          {dailyHits ? (
            <Chart 
              options={options} 
              series={series} 
              type="bar" 
              height={180} 
            />
          ) : (
            <div className="h-[180px] flex items-center justify-center">
              Loading data...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}