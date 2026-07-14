import { useState, useEffect } from "react";
import {
  getDayAnalytics,
  getWeekAnalytics,
  getCustomRangeAnalytics,
  getAllAnalytics,
} from "../../utils/AnalyticsAPIHandler";
import OrganizerNavbar from "../../components/OrganizerNavbar";
import OrganizerViewSession from "../../components/OrganizerViewSession";
import { useOverlay } from "../../contexts/OverlayContext";
import { IoMenu } from "react-icons/io5";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface AllTimeData {
  sessionStats: {
    _count: {
      id: number;
    };
    _avg: {
      sessionLength: number;
    };
  };
  pageViews: {
    _count: {
      id: number;
    };
  };
  pagesPerSession: number;
  activeUsers: number;
  deviceBreakdown: [
    {
      _count: {
        id: number;
      };
      deviceType: string;
    },
  ];
  osBreakdown: [
    {
      _count: {
        id: number;
      };
      operatingSystem: string;
    },
  ];
  browserBreakdown: [
    {
      _count: {
        id: number;
      };
      browser: string;
    },
  ];
  pageViewsPerDay: { [key: string]: number };
}

interface FilteredData {
  pageViews: [
    {
      id: string;
      userId: string | null;
      createdAt: string;
      url: string;
      sessionId: string;
      user: {
        id: string | undefined;
        firstName: string | undefined;
        lastName: string | undefined;
      };
    },
  ];
}

export default function Analytics() {
  const [filter, setFilter] = useState<"day" | "week" | "custom">("day");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().slice(0, 10),
  ); // Only used for custom range
  const [allTimeData, setAllTimeData] = useState<AllTimeData | null>(null);
  const [filteredData, setFilteredData] = useState<FilteredData | null>(null);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const pieChartColors = [
    "#e89eb8",
    "#006994",
    "#507d2a",
    "#ee7600",
    "#b666d2",
  ]; // Soft Pink, Sea Blue, Sap Green, Deep Orange, Lilac Color
  // ^ I picked these colors from eggradeints.com, the best color website out there
  const { openOverlay } = useOverlay();

  useEffect(() => {
    const fetchAllTimeData = async () => {
      const fetchedData = await getAllAnalytics();
      setAllTimeData(fetchedData);
    };

    fetchAllTimeData();
  }, []);

  useEffect(() => {
    const fetchFilteredData = async () => {
      let fetchedData;
      if (filter === "day") {
        fetchedData = await getDayAnalytics(startDate);
      } else if (filter === "week") {
        fetchedData = await getWeekAnalytics(startDate);
      } else if (filter === "custom") {
        fetchedData = await getCustomRangeAnalytics(startDate, endDate);
      }
      if (fetchedData) {
        setFilteredData(fetchedData);
      }
    };

    fetchFilteredData();
  }, [filter, startDate, endDate]);

  const handleOpenViewSession = (sessionId: string) => {
    openOverlay(<OrganizerViewSession sessionId={sessionId} />);
  };

  return (
    <div className="relative w-screen h-screen flex flex-col sm:flex-row bg-surface-a0 text-white">
      <div
        className={`${
          navbarOpen ? "absolute inset-0 z-50 block bg-black/50" : "hidden"
        } md:block w-full md:w-1/5 lg:w-1/6 h-full`}
        onClick={() => setNavbarOpen(false)}
      >
        <div
          className="w-1/2 sm:w-1/3 md:w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <OrganizerNavbar />
        </div>
      </div>
      <div className="flex flex-col ml-6 md:ml-0 w-[calc(100%-1.5rem)] md:w-4/5 lg:w-5/6 h-full overflow-y-auto p-4 items-center">
        <button
          className={`absolute top-4 left-4 md:hidden ${
            navbarOpen ? "hidden" : ""
          }`}
          onClick={() => setNavbarOpen(true)}
        >
          <IoMenu className="text-3xl hover:text-4xl" />
        </button>
        <h1 className="text-3xl font-bold mb-4">Analytics</h1>
        <div className="w-5/6">
          <h2 className="text-2xl font-semibold mb-2">All Time Stats</h2>
          <div className="w-full bg-surface-a1 p-4 rounded-lg">
            {!allTimeData ? (
              <p>Loading...</p>
            ) : (
              <div className="flex flex-col">
                <div className="flex flex-row">
                  <div className="flex flex-col m-2 items-center">
                    <div className="flex p-2 rounded-lg bg-surface-a2">
                      <span className="font-bold text-6xl text-primary-a0">
                        {allTimeData.sessionStats._count.id}
                      </span>
                    </div>
                    <h3 className="text-xl">Sessions</h3>
                  </div>
                  <div className="flex flex-col m-2 items-center">
                    <div className="flex p-2 rounded-lg bg-surface-a2">
                      <span className="font-bold text-6xl text-primary-a0">
                        {allTimeData.pageViews._count.id}
                      </span>
                    </div>
                    <h3 className="text-xl">Page Views</h3>
                  </div>
                  <div className="flex flex-col m-2 items-center">
                    <div className="flex p-2 rounded-lg bg-surface-a2">
                      <span className="font-bold text-6xl text-primary-a0">
                        {allTimeData.pagesPerSession.toFixed(0)}
                      </span>
                    </div>
                    <h3 className="text-xl">Views per Session</h3>
                  </div>
                  <div className="flex flex-col m-2 items-center">
                    <div className="flex p-2 rounded-lg bg-surface-a2">
                      <span className="font-bold text-6xl text-primary-a0">
                        {allTimeData.activeUsers}
                      </span>
                    </div>
                    <h3 className="text-xl">Active Users</h3>
                  </div>
                  <div className="flex flex-col m-2 items-center">
                    <div className="flex p-2 rounded-lg bg-surface-a2">
                      <span className="font-bold text-6xl text-primary-a0">
                        {(
                          allTimeData.sessionStats._avg.sessionLength / 1000
                        ).toFixed(0)}
                      </span>
                    </div>
                    <h3 className="text-xl">Average Session Length (s)</h3>
                  </div>
                </div>
                <div className="flex flex-row">
                  <div className="w-1/3 p-2 flex flex-col items-center">
                    <h3>Device Breakdown</h3>
                    <ResponsiveContainer width="100%" height={150}>
                      <PieChart>
                        <Pie
                          data={allTimeData.deviceBreakdown.map((item) => ({
                            name: item.deviceType,
                            value: item._count.id,
                            fill: pieChartColors[
                              allTimeData.deviceBreakdown.indexOf(item) %
                                pieChartColors.length
                            ],
                          }))}
                        />
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-1/3 p-2 flex flex-col items-center">
                    <h3>OS Breakdown</h3>
                    <ResponsiveContainer width="100%" height={150}>
                      <PieChart>
                        <Pie
                          data={allTimeData.osBreakdown.map((item) => ({
                            name: item.operatingSystem,
                            value: item._count.id,
                            fill: pieChartColors[
                              allTimeData.osBreakdown.indexOf(item) %
                                pieChartColors.length
                            ],
                          }))}
                        />
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-1/3 p-2 flex flex-col items-center">
                    <h3>Browser Breakdown</h3>
                    <ResponsiveContainer width="100%" height={150}>
                      <PieChart>
                        <Pie
                          data={allTimeData.browserBreakdown.map((item) => ({
                            name: item.browser,
                            value: item._count.id,
                            fill: pieChartColors[
                              allTimeData.browserBreakdown.indexOf(item) %
                                pieChartColors.length
                            ],
                          }))}
                        />
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <h3 className="text-xl font-bold mt-4">Page Views Per Day</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart
                    data={Object.entries(allTimeData.pageViewsPerDay).map(
                      ([date, count]) => ({ date, pageViews: count }),
                    )}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: "#575757" }} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="pageViews"
                      className="stroke-primary-a0" // For some reason this only works when both of these lines are present
                      stroke="var(--primary-a0)"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
        <div className="w-5/6">
          <h2 className="text-2xl font-semibold mb-2">
            {filter.charAt(0).toUpperCase() + filter.slice(1)} Stats
          </h2>
          <div className="w-full bg-surface-a1 p-4 rounded-lg">
            <div className="flex flex-row mb-2">
              <select
                name="filter"
                id="filter"
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value as "day" | "week" | "custom")
                }
                className="bg-surface-a2 rounded-lg p-2"
              >
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="custom">Custom Range</option>
              </select>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-surface-a2 rounded-lg p-2 ml-2"
              />
              {filter === "custom" && (
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={endDate as string}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-surface-a2 rounded-lg p-2 ml-2"
                />
              )}
            </div>
            {!filteredData ? (
              <p>Loading...</p>
            ) : (
              <div className="flex w-full overflow-y-auto max-h-100">
                <table className="w-full rounded-lg">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b border-r border-surface-a0 text-left bg-surface-a2"></th>
                      <th className="py-2 px-4 border-b border-r border-surface-a0 text-left bg-surface-a2">
                        URL
                      </th>
                      <th className="py-2 px-4 border-b border-r border-surface-a0 text-left bg-surface-a2">
                        Name
                      </th>
                      <th className="py-2 px-4 border-b border-r border-surface-a0 text-left bg-surface-a2">
                        Date
                      </th>
                      <th className="py-2 px-4 border-b border-r border-surface-a0 text-left bg-surface-a2">
                        Session
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.pageViews.map((item, index) => (
                      <tr key={item.id}>
                        <td
                          className={`py-2 px-4 border-b border-r border-surface-a0 ${index % 2 === 0 ? "bg-surface-a3" : "bg-surface-a2"}`}
                        >
                          {index + 1}
                        </td>
                        <td
                          className={`py-2 px-4 border-b border-r border-surface-a0 ${index % 2 === 0 ? "bg-surface-a3" : "bg-surface-a2"}`}
                        >
                          {item.url}
                        </td>
                        <td
                          className={`py-2 px-4 border-b border-r border-surface-a0 ${index % 2 === 0 ? "bg-surface-a3" : "bg-surface-a2"}`}
                        >
                          {item.user ? item.user.firstName : "N/A"}
                        </td>
                        <td
                          className={`py-2 px-4 border-b border-r border-surface-a0 ${index % 2 === 0 ? "bg-surface-a3" : "bg-surface-a2"}`}
                        >
                          {new Date(item.createdAt).toLocaleDateString() +
                            " - " +
                            new Date(item.createdAt).toLocaleTimeString()}
                        </td>
                        <td
                          className={`py-2 px-4 border-b border-r border-surface-a0 ${index % 2 === 0 ? "bg-surface-a3" : "bg-surface-a2"}`}
                        >
                          <button
                            className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg w-full"
                            onClick={() =>
                              handleOpenViewSession(item.sessionId)
                            }
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
