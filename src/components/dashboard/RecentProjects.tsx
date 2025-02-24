import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

// Define the TypeScript interface for the table rows
interface Projects {
  id: number; // Unique identifier for each project
  name: string; // Project name
  location: string; // Location of the project
  type: string; // Type of the project (e.g., Residential, Commercial)
  completionDate: string; // Expected or actual completion date
  status: "Completed" | "In Progress" | "On Hold"; // Status of the project
  image: string; // URL or path to the project image
}

// Define the table data using the interface
const tableData: Projects[] = [
  {
    id: 1,
    name: "YAS ACRES",
    location: "Abu Dhabi",
    type: "Residential",
    completionDate: "2023-12-31",
    status: "Completed",
    image: "https://cdn.prod.website-files.com/65b8ae9b3af43cf735dab067/65ca07f0e80b55e2f8589b84_65b8ae9b3af43cf735dac580_64e8660a745bb8e444d4fcf9_64a2a8f1fcd8c1949a14f6bf_gallery_4.webp", // Replace with actual image URL
  },
  {
    id: 2,
    name: "Dubai Marina Complex",
    location: "Dubai",
    type: "Commercial",
    completionDate: "2024-06-30",
    status: "In Progress",
    image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/164648677.jpg?k=d55e8a672df63892bb63a0e951c6ce838340942bc7bd736afa7ce21674d48413&o=&hp=1", // Replace with actual image URL
  },
  {
    id: 3,
    name: "ROVE HOTEL",
    location: "Dubai",
    type: "Hospitality",
    completionDate: "2025-01-15",
    status: "On Hold",
    image: "https://d3mgaxfqdimhxa.cloudfront.net/wp-content/uploads/2021/03/1920x1280-56-1000x667.jpg", // Replace with actual image URL
  },
  {
    id: 4,
    name: "Ajman Waterfront Residences",
    location: "Ajman",
    type: "Residential",
    completionDate: "2024-09-01",
    status: "In Progress",
    image: "https://www.propertyfinder.ae/property/0ca2dc83bfc8de9871498512b3497285/416/272/MODE/92d191/13606645-9adedo.webp?ctr=ae", // Replace with actual image URL
  },
  // {
  //   id: 5,
  //   name: "Ras Al Khaimah Mall",
  //   location: "Ras Al Khaimah",
  //   type: "Commercial",
  //   completionDate: "2025-03-01",
  //   status: "In Progress",
  //   image: "/images/projects/project-05.jpg", // Replace with actual image URL
  // },
];

export default function RecentProjects() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Projects
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Project Name
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Location
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Type
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Completion Date
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.map((project) => (
              <TableRow key={project.id} className="">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                      <img
                        src={project.image}
                        className="h-[50px] w-[50px]"
                        alt={project.name}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {project.name}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {project.location}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {project.location}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {project.type}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {project.completionDate}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      project.status === "Completed"
                        ? "success"
                        : project.status === "In Progress"
                        ? "warning"
                        : "error"
                    }
                  >
                    {project.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}